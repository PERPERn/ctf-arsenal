// Browser-side identifier — a compact TypeScript port of the ctfid engine.
// Runs fully client-side: paste text or drop a file and it identifies and,
// where possible, decodes it, then suggests which tool to reach for next.

export type Lang = "th" | "en";

export interface IdItem { conf: "high" | "med" | "low"; label: string; detail?: string; }
export interface DecodeResult { chain: string[]; text: string; isFlag: boolean; score: number; }
export interface Suggestion { tool?: string; text: { th: string; en: string }; }
export interface JwtParts { header: Record<string, unknown>; payload: Record<string, unknown>; warnings: string[]; }
export interface TextReport { input: string; ids: IdItem[]; decodes: DecodeResult[]; answer?: string; suggestions: Suggestion[]; jwt?: JwtParts; plaintext: boolean; terminal: boolean; }
export interface FileReport {
  name: string; size: number; entropy: number; magic?: string; hex: string;
  strings: string[]; flags: string[]; suggestions: Suggestion[]; text?: TextReport;
}

const FLAG_RE = /\b([A-Za-z][A-Za-z0-9_.\-]{1,24})\{([^{}\x00-\x1f]{1,200}?)\}/;
const FLAG_RE_G = /\b([A-Za-z][A-Za-z0-9_.\-]{1,24})\{([^{}\x00-\x1f]{1,200}?)\}/g;
const KNOWN = new Set(["ctt","thctt","tcctf","flag","ctf","delta","tjctf","sit","itclash","itopenhouse","picoctf","htb","kmitl"]);

export function looksLikeFlag(s: string): { flag: string; strong: boolean } | null {
  let best: { flag: string; strong: boolean } | null = null;
  for (const m of s.matchAll(FLAG_RE_G)) {
    const prefix = m[1], body = m[2];
    if (!/^[A-Za-z0-9_\-@!?+=.,:;#$%^&*()/' ]+$/.test(body)) continue;
    const alnum = (body.match(/[A-Za-z0-9]/g) || []).length;
    if (!/^[A-Za-z0-9]+$/.test(prefix)) continue;
    const low = prefix.toLowerCase();
    const strong = KNOWN.has(low) || low.includes("ctf");
    if (strong) { if (alnum >= 2 && alnum >= body.length * 0.5) return { flag: m[0], strong }; }
    else if (prefix.length >= 3 && body.length >= 4 && alnum >= body.length * 0.7 && /^[A-Za-z0-9_\-]+$/.test(body)) {
      if (!best) best = { flag: m[0], strong };
    }
  }
  return best;
}

const COMMON = new Set("the be to of and a in that have it for not on with he as you do at this but from they we her she or will my one all would there what so up out if about who get go me when make can like time no just know take into your good some could them see other than then now look only come over think back after use two how our work first well way even new want because any these give day most us is are was were hello world test this here your name file data code message secret password flag key admin user login pass root welcome congratulations congrats correct answer solved found done nice great good luck the quick brown fox jumps over lazy dog".split(" "));
const BIGRAMS = new Set("th he in er an re on at en nd ti es or te of ed is it al ar st to nt ng se ha as ou io le ve co me de hi ri ro ic ne ea ra ce li ch ll be ma si om ur ca el ho ta la ns di sh ss et pe ec ol rs il no ut ad".split(" "));

function printableRatio(s: string) { let ok = 0; for (const c of s) { const x = c.charCodeAt(0); if ((x >= 32 && x < 127) || x === 9 || x === 10 || x === 13) ok++; } return s.length ? ok / s.length : 0; }
function bigramScore(t: string) { const L = t.toLowerCase().replace(/[^a-z]/g, " "); const p: string[] = []; for (let i = 0; i < L.length - 1; i++) { const b = L.slice(i, i + 2); if (!b.includes(" ")) p.push(b); } if (!p.length) return 0; return p.filter((x) => BIGRAMS.has(x)).length / p.length; }

export function scoreText(s: string, flagBonus = true): number {
  if (!s) return 0;
  const pr = printableRatio(s);
  if (pr < 0.75) return pr * 0.3;
  const t = s.toLowerCase(), n = t.length;
  const ok = new Set("abcdefghijklmnopqrstuvwxyz0123456789 .,'\"!?;:-_/(){}@\n\t".split(""));
  let sanity = [...t].filter((c) => ok.has(c)).length / n;
  const weird = [...t].filter((c) => "^~`|\\<>[]#$%&*+=".includes(c)).length / n;
  sanity -= Math.min(0.5, weird);
  const ls = [...t].filter((c) => /[a-z ]/.test(c)).length / n;
  const words = t.match(/[a-z']{2,}/g) || [];
  const covered = words.filter((w) => COMMON.has(w)).reduce((a, w) => a + w.length, 0);
  const coverage = Math.min(1, (covered / n) * 2.5);
  const letters = [...t].filter((c) => c >= "a" && c <= "z");
  let vowels = 0;
  if (letters.length) { const vr = letters.filter((c) => "aeiou".includes(c)).length / letters.length; vowels = 1 - Math.min(1, Math.abs(vr - 0.4) / 0.4); }
  const wordHits = words.filter((w) => COMMON.has(w)).length;
  let sc = (0.18 * Math.max(sanity, 0) + 0.15 * ls + 0.24 * bigramScore(t) + 0.28 * coverage + 0.1 * vowels) * pr;
  // real English almost always has a space or a dictionary word; gibberish
  // like "lillil" or "HILLEWELT" rarely does — damp it hard.
  if (n > 6 && wordHits === 0 && !/\s/.test(t.trim())) sc *= 0.4;
  if (n > 6 && wordHits === 0 && (t.match(/[^a-z0-9 ]/g) || []).length > n * 0.2) sc *= 0.6;
  if (flagBonus) { const f = looksLikeFlag(s); if (f) sc += f.strong ? 0.45 : 0.1; }
  return Math.min(sc, 1);
}

// ── decoders ──────────────────────────────────────────────────────────────
const clean = (s: string) => s.replace(/\s+/g, "");
function b64(s: string): string | null { const c = clean(s); if (c.length < 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(c)) return null; try { const bin = atob(c + "=".repeat((4 - (c.length % 4)) % 4)); return bin; } catch { return null; } }
function b64url(s: string): string | null { const c = clean(s); if (c.length < 4 || !/^[A-Za-z0-9_\-]+={0,2}$/.test(c) || !/[_\-]/.test(c)) return null; try { return atob(c.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (c.length % 4)) % 4)); } catch { return null; } }
function b32(s: string): string | null { const c = clean(s).toUpperCase().replace(/=+$/, ""); if (c.length < 8 || !/^[A-Z2-7]+$/.test(c)) return null; const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"; let bits = "", out = ""; for (const ch of c) bits += A.indexOf(ch).toString(2).padStart(5, "0"); for (let i = 0; i + 8 <= bits.length; i += 8) out += String.fromCharCode(parseInt(bits.slice(i, i + 8), 2)); return out || null; }
function hex(s: string): string | null { const c = clean(s); if (c.length < 4 || c.length % 2 || !/^[0-9a-fA-F]+$/.test(c)) return null; let out = ""; for (let i = 0; i < c.length; i += 2) out += String.fromCharCode(parseInt(c.slice(i, i + 2), 16)); return out; }
function hexSpaced(s: string): string | null { const t = s.trim().split(/[\s,;:]+|\\x|0x|%/).filter(Boolean); if (t.length < 2 || !t.every((x) => /^[0-9a-fA-F]{2}$/.test(x))) return null; return t.map((x) => String.fromCharCode(parseInt(x, 16))).join(""); }
function bin(s: string): string | null { let c = s.replace(/[\s,]/g, ""); if (c.length < 8 || /[^01]/.test(c)) return null; if (c.length % 8) c = c.padStart(c.length + ((8 - (c.length % 8)) % 8), "0"); let out = ""; for (let i = 0; i < c.length; i += 8) out += String.fromCharCode(parseInt(c.slice(i, i + 8), 2)); return out; }
function dec(s: string): string | null { const t = s.trim().split(/[\s,;]+/).filter(Boolean); if (t.length < 2 || !t.every((x) => /^\d+$/.test(x) && +x < 1114112)) return null; return t.map((x) => String.fromCharCode(+x)).join(""); }
function urlDec(s: string): string | null { if (!/%[0-9a-fA-F]{2}/.test(s) && !s.includes("+")) return null; try { const o = decodeURIComponent(s.replace(/\+/g, " ")); return o !== s ? o : null; } catch { return null; } }
function rot13(s: string): string | null { if (!/[A-Za-z]/.test(s)) return null; return s.replace(/[A-Za-z]/g, (c) => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b); }); }
function rot47(s: string): string | null { if (!s) return null; return [...s].map((c) => { const x = c.charCodeAt(0); return x >= 33 && x <= 126 ? String.fromCharCode(33 + ((x - 33 + 47) % 94)) : c; }).join(""); }
function atbash(s: string): string | null { if (!/[A-Za-z]/.test(s)) return null; return s.replace(/[A-Za-z]/g, (c) => { if (c >= "a" && c <= "z") return String.fromCharCode(219 - c.charCodeAt(0)); return String.fromCharCode(155 - c.charCodeAt(0)); }); }
function reverse(s: string): string | null { return s.length < 4 ? null : [...s].reverse().join(""); }
const MORSE: Record<string, string> = { ".-":"A","-...":"B","-.-.":"C","-..":"D",".":"E","..-.":"F","--.":"G","....":"H","..":"I",".---":"J","-.-":"K",".-..":"L","--":"M","-.":"N","---":"O",".--.":"P","--.-":"Q",".-.":"R","...":"S","-":"T","..-":"U","...-":"V",".--":"W","-..-":"X","-.--":"Y","--..":"Z","-----":"0",".----":"1","..---":"2","...--":"3","....-":"4",".....":"5","-....":"6","--...":"7","---..":"8","----.":"9",".-.-.-":".","--..--":",","..--..":"?","-..-.":"/","-....-":"-","..--.-":"_","-.--.":"(","-.--.-":")",".--.-.":"@","---...":":","-.-.--":"!" };
function morse(s: string): string | null { let t = s.trim().replace(/_/g, "-"); if (!t || /[^.\-/ \t\n|]/.test(t) || (!t.includes(".") && !t.includes("-"))) return null; const words = t.split(/\s*[/|]\s*|\s{3,}/); const out = words.map((w) => w.split(/\s+/).filter(Boolean).map((tok) => MORSE[tok] ?? "?").join("")).join(" "); if (!out || (out.match(/\?/g) || []).length > out.length * 0.3) return null; return out; }
function caesar(s: string): string | null { if (!/[A-Za-z]/.test(s)) return null; let best: string | null = null, bs = 0; for (let sh = 1; sh < 26; sh++) { if (sh === 13) continue; const o = s.replace(/[A-Za-z]/g, (c) => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + sh) % 26) + b); }); const sc = scoreText(o, false) + (looksLikeFlag(o) ? 0.5 : 0); if (sc > bs) { bs = sc; best = o; } } return bs > 0.6 ? best : null; }
function xor1(s: string): string | null { if (s.length < 4) return null; let best: string | null = null, bs = 0; for (let k = 1; k < 256; k++) { const o = [...s].map((c) => String.fromCharCode(c.charCodeAt(0) ^ k)).join(""); const sc = scoreText(o, false) + (looksLikeFlag(o) ? 0.5 : 0); if (sc > bs) { bs = sc; best = o; } } return bs > 0.6 ? best : null; }

const DECODERS: [string, (s: string) => string | null][] = [
  ["base64", b64], ["base64url", b64url], ["base32", b32], ["hex", hex], ["hex-spaced", hexSpaced],
  ["binary", bin], ["decimal", dec], ["url-decode", urlDec], ["rot13", rot13], ["rot47", rot47],
  ["atbash", atbash], ["caesar", caesar], ["reverse", reverse], ["morse", morse], ["xor-1byte", xor1],
];
const SELF_INV = new Set(["rot13", "rot47", "atbash", "reverse"]);

const LABEL_DECODER: [RegExp, string][] = [
  [/Morse/, "morse"], [/Binary digits/, "binary"], [/Base32/, "base32"],
  [/Base64/, "base64"], [/URL-encoded/, "url-decode"], [/Hex string/, "hex"],
];
export function preferredDecoders(raw: string): Set<string> {
  const out = new Set<string>();
  for (const it of identifyText(raw.trim())) {
    if (it.conf === "low") continue;
    for (const [re, dec] of LABEL_DECODER) if (re.test(it.label)) out.add(dec);
  }
  return out;
}

export function decodeChain(input: string, preferred: Set<string> = new Set(), maxDepth = 5, maxNodes = 260): DecodeResult[] {
  const seen = new Set([input]);
  let frontier: { blob: string; path: string[] }[] = [{ blob: input, path: [] }];
  const results: DecodeResult[] = [];
  let nodes = 0;
  while (frontier.length && nodes < maxNodes) {
    const next: { blob: string; path: string[] }[] = [];
    for (const { blob, path } of frontier) {
      if (path.length >= maxDepth) continue;
      for (const [name, fn] of DECODERS) {
        if (path.length && path[path.length - 1] === name && SELF_INV.has(name)) continue;
        if (blob.length > 200000) continue;
        let out: string | null = null;
        try { out = fn(blob); } catch { out = null; }
        if (!out || seen.has(out) || out === blob) continue;
        nodes++;
        seen.add(out);
        const np = [...path, name];
        const f = looksLikeFlag(out);
        results.push({ chain: np, text: out, isFlag: !!(f && f.strong), score: scoreText(out) });
        if (f && f.strong) continue;
        if (scoreText(out, false) > 0.25 || out.length > 8) next.push({ blob: out, path: np });
      }
    }
    frontier = next.sort((a, b) => scoreText(b.blob, false) - scoreText(a.blob, false)).slice(0, 18);
  }
  const rank = (r: DecodeResult) => {
    const bonus = (r.chain.length && preferred.has(r.chain[0]) ? 0.3 : 0) - 0.05 * (r.chain.length - 1);
    return { flag: Number(r.isFlag), s: r.score + bonus, len: r.chain.length };
  };
  results.sort((a, b) => { const x = rank(a), y = rank(b); return (y.flag - x.flag) || (y.s - x.s) || (x.len - y.len); });
  return results;
}

const HASH_LEN: Record<number, string> = { 32: "MD5, NTLM, MD4", 40: "SHA-1, RIPEMD-160", 56: "SHA-224", 64: "SHA-256, SHA3-256, BLAKE2", 96: "SHA-384", 128: "SHA-512, Whirlpool", 16: "MySQL323, CRC-64", 8: "CRC-32" };

export function identifyText(raw: string): IdItem[] {
  const s = raw.trim(), out: IdItem[] = [], n = s.length;
  const f = looksLikeFlag(s);
  if (f) out.push({ conf: f.strong ? "high" : "med", label: "Flag format match", detail: f.flag });
  if (/^[0-9a-fA-F]+$/.test(s) && HASH_LEN[n]) out.push({ conf: "high", label: `Hash (${n} hex chars)`, detail: HASH_LEN[n] });
  else if (/^[0-9a-fA-F]+$/.test(s) && n % 2 === 0 && n >= 4) out.push({ conf: "med", label: `Hex string (${n / 2} bytes)` });
  if (/^\$[0-9a-z]{1,3}[a-z]?\$/.test(s)) out.push({ conf: "high", label: "Unix crypt hash", detail: "crack: john / hashcat" });
  if (/^[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]*$/.test(s)) out.push({ conf: "high", label: "JWT", detail: "decode/forge at jwt.io" });
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s)) out.push({ conf: "high", label: `UUID v${s[14]}` });
  if (/^(?:[0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}$/.test(s)) out.push({ conf: "high", label: "MAC address" });
  if (/^(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,2})?$/.test(s)) out.push({ conf: "high", label: "IPv4 address/CIDR" });
  if (s.startsWith("-----BEGIN")) out.push({ conf: "high", label: "PEM block", detail: s.split("\n")[0] });
  if (/^[.\-_/ \t\n|]+$/.test(s) && n > 2) out.push({ conf: "high", label: "Morse code" });
  if (/^[01\s]+$/.test(s) && n > 8) out.push({ conf: "high", label: "Binary digits" });
  if (/^[A-Z2-7]+=*$/.test(s) && n >= 8 && s.includes("=") && !/\s/.test(s)) out.push({ conf: "med", label: "Base32" });
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(s) && n >= 8 && (s.includes("=") || n % 4 === 0) && !/^[0-9a-fA-F]+$/.test(s) && !/\s/.test(s)) out.push({ conf: "med", label: "Base64" });
  if (/%[0-9a-fA-F]{2}/.test(s)) out.push({ conf: "med", label: "URL-encoded" });
  if (/[​-‏⁠﻿]/.test(s)) out.push({ conf: "high", label: "Zero-width characters", detail: "unicode steganography" });
  if (s.startsWith("{") || s.startsWith("[")) { try { JSON.parse(s); out.push({ conf: "high", label: "JSON" }); } catch {} }
  return out;
}

const RECO: [RegExp, string | undefined, { th: string; en: string }][] = [
  [/^Hash \(/, "hashcat", { th: "แครก: hashcat -m <mode> hash.txt rockyou.txt หรือ john", en: "crack: hashcat -m <mode> hash.txt rockyou.txt or john" }],
  [/Unix crypt/, "john", { th: "แครก: john --wordlist=rockyou.txt hash.txt", en: "crack: john --wordlist=rockyou.txt hash.txt" }],
  [/JWT/, undefined, { th: "ถอด/ปลอมที่ jwt.io ลอง alg:none และ hashcat -m 16500", en: "decode/forge at jwt.io; try alg:none and hashcat -m 16500" }],
  [/PEM/, "openssl", { th: "ดู: openssl rsa -in key.pem -text ; RSA อ่อน → RsaCtfTool", en: "openssl rsa -in key.pem -text; weak RSA → RsaCtfTool" }],
  [/Zero-width/, undefined, { th: "unicode steg — ดูบิตที่แสดงด้านล่าง", en: "unicode steg — see the extracted bits below" }],
  [/Morse/, undefined, { th: "ถอดให้แล้วด้านล่าง", en: "decoded below" }],
  [/PNG|BMP/, "zsteg", { th: "steg รูป: zsteg -a f.png ; binwalk -e ; exiftool", en: "image steg: zsteg -a f.png; binwalk -e; exiftool" }],
  [/JPEG/, "stegseek", { th: "steg jpeg: stegseek f.jpg rockyou.txt ; exiftool ; binwalk", en: "jpeg steg: stegseek f.jpg rockyou.txt; exiftool; binwalk" }],
  [/ELF|PE|Mach-O/, "ghidra", { th: "reverse: ghidra หรือ r2 -AA ; strings ; checksec", en: "reverse: ghidra or r2 -AA; strings; checksec" }],
  [/ZIP|archive/, "7z", { th: "แตก: 7z x f.zip ; ถ้าล็อก → zip2john + john", en: "extract: 7z x f.zip; if locked → zip2john + john" }],
  [/PDF/, "exiftool", { th: "pdf: exiftool ; binwalk -e ; strings -n8 ; pdf-parser", en: "pdf: exiftool; binwalk -e; strings -n8; pdf-parser" }],
  [/PCAP/, undefined, { th: "network: wireshark ; tshark -r f.pcap ; follow stream", en: "network: wireshark; tshark -r f.pcap; follow streams" }],
  [/Android|DEX/, "jadx", { th: "decompile: jadx-gui app.apk ; grep flag/http", en: "decompile: jadx-gui app.apk; grep flag/http" }],
  [/SQLite/, undefined, { th: "เปิด: sqlite3 f.db '.dump'", en: "open: sqlite3 f.db '.dump'" }],
  [/entropy|High entropy/, undefined, { th: "เข้ารหัส/บีบอัด — ลอง binwalk, gunzip, XOR, หา key ก่อน", en: "encrypted/compressed — try binwalk, gunzip, XOR; find the key first" }],
  [/Binary data/, "binwalk", { th: "binary: binwalk -e ; foremost ; strings ; xxd | head", en: "binary: binwalk -e; foremost; strings; xxd | head" }],
];

export function suggestFor(labels: string[]): Suggestion[] {
  const out: Suggestion[] = [], seen = new Set<string>();
  for (const label of labels) for (const [re, tool, text] of RECO) {
    const key = re.source;
    if (seen.has(key)) continue;
    if (re.test(label)) { seen.add(key); out.push({ tool, text }); break; }
  }
  return out;
}

function pickEndorsed(results: DecodeResult[], preferred: Set<string>): DecodeResult | undefined {
  const cands = results.filter((r) => r.chain.length && preferred.has(r.chain[0]));
  cands.sort((a, b) => (a.chain.length - b.chain.length) || (b.score - a.score));
  return cands[0];
}
function decodeJwt(s: string): JwtParts | undefined {
  const parts = s.split(".");
  if (parts.length < 2) return undefined;
  const dec = (p: string) => { try { return JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (p.length % 4)) % 4))); } catch { return null; } };
  const header = dec(parts[0]), payload = dec(parts[1]);
  if (!header || !payload || typeof header !== "object") return undefined;
  const warnings: string[] = [];
  const alg = String((header as any).alg ?? "");
  if (/^none$/i.test(alg)) warnings.push("alg:none — token is unsigned and forgeable");
  if (/^HS/.test(alg)) warnings.push("HMAC alg — a weak secret can be cracked (hashcat -m 16500)");
  if ((payload as any).exp && (payload as any).exp * 1000 < Date.now()) warnings.push("token is expired");
  return { header, payload, warnings };
}

const TERMINAL_LABELS = /^(Hash|Unix crypt|JWT|UUID|MAC|IPv4|PEM|Unix timestamp|JSON)/;

export function analyzeText(raw: string): TextReport {
  const trimmed = raw.trim();
  const ids = identifyText(trimmed);
  const preferred = preferredDecoders(trimmed);
  const allDecodes = decodeChain(trimmed, preferred);
  const flag = looksLikeFlag(trimmed);
  const jwt = ids.some((i) => i.label === "JWT") ? decodeJwt(trimmed) : undefined;
  const inputScore = scoreText(trimmed, false);
  const plaintext = !flag && inputScore >= 0.55 && !/^[A-Za-z0-9+/=]+$/.test(trimmed);

  // Keep only decodes that mean something: a flag, an endorsed first step, or a
  // genuinely readable result that beats the raw input. Everything else is the
  // combinatorial noise that made Identify feel unreliable.
  const decodes = allDecodes.filter((d) =>
    d.isFlag || preferred.has(d.chain[0]) || (d.score >= 0.6 && scoreText(d.text, false) > inputScore + 0.08)
  ).slice(0, 8);

  let answer: string | undefined;
  if (flag) answer = flag.flag;
  else {
    const f = decodes.find((d) => d.isFlag);
    if (f) answer = f.text;
    else {
      const e = pickEndorsed(decodes, preferred);
      if (e && scoreText(e.text, false) >= 0.45) answer = e.text;
      else if (decodes[0] && scoreText(decodes[0].text, false) >= 0.72) answer = decodes[0].text;
    }
  }

  // Once we have a confident answer, drop everything that isn't a flag or an
  // endorsed decode so the panel shows the solution, not near-misses.
  let shown = decodes;
  if (answer) {
    const clean = decodes.filter((d) => d.isFlag || preferred.has(d.chain[0]));
    if (clean.length) shown = clean;
  }
  const terminal = !answer && !plaintext && ids.length > 0 && TERMINAL_LABELS.test(ids[0].label);
  return { input: raw, ids, decodes: shown, answer, suggestions: suggestFor(ids.map((i) => i.label)), jwt, plaintext, terminal };
}

// ── file analysis ───────────────────────────────────────────────────────────
const MAGICS: [number[], string][] = [
  [[0x89,0x50,0x4e,0x47], "PNG image"], [[0xff,0xd8,0xff], "JPEG image"], [[0x47,0x49,0x46,0x38], "GIF image"],
  [[0x42,0x4d], "BMP image"], [[0x52,0x49,0x46,0x46], "RIFF (WAV/AVI/WEBP)"], [[0x50,0x4b,0x03,0x04], "ZIP archive (or docx/apk/jar)"],
  [[0x50,0x4b,0x05,0x06], "ZIP (empty)"], [[0x52,0x61,0x72,0x21], "RAR archive"], [[0x37,0x7a,0xbc,0xaf], "7-Zip archive"],
  [[0x1f,0x8b], "GZIP stream"], [[0x42,0x5a,0x68], "BZIP2 stream"], [[0xfd,0x37,0x7a,0x58,0x5a], "XZ stream"],
  [[0x25,0x50,0x44,0x46], "PDF document"], [[0x7f,0x45,0x4c,0x46], "ELF binary"], [[0x4d,0x5a], "PE/DOS executable"],
  [[0xca,0xfe,0xba,0xbe], "Java class / Mach-O fat"], [[0xcf,0xfa,0xed,0xfe], "Mach-O 64-bit"], [[0x64,0x65,0x78,0x0a], "Android DEX"],
  [[0x53,0x51,0x4c,0x69,0x74,0x65], "SQLite database"], [[0xd4,0xc3,0xb2,0xa1], "PCAP capture"], [[0x0a,0x0d,0x0d,0x0a], "PCAPNG capture"],
  [[0x2d,0x2d,0x2d,0x2d,0x2d], "PEM / text block"], [[0x49,0x49,0x2a,0x00], "TIFF image"], [[0x4d,0x4d,0x00,0x2a], "TIFF image"],
];

function matchMagic(b: Uint8Array): string | undefined {
  for (const [sig, name] of MAGICS) if (sig.every((v, i) => b[i] === v)) return name;
  if (b.length > 261 && [0x75,0x73,0x74,0x61,0x72].every((v, i) => b[257 + i] === v)) return "TAR archive";
  return undefined;
}
function entropy(b: Uint8Array): number { if (!b.length) return 0; const c = new Array(256).fill(0); for (const x of b) c[x]++; let e = 0; for (const v of c) if (v) { const p = v / b.length; e -= p * Math.log2(p); } return e; }
function extractStrings(b: Uint8Array, min = 6, max = 60): string[] {
  const out: string[] = []; let cur = "";
  for (const x of b) { if (x >= 32 && x < 127) { cur += String.fromCharCode(x); } else { if (cur.length >= min) out.push(cur); cur = ""; if (out.length > 4000) break; } }
  if (cur.length >= min) out.push(cur);
  return out.slice(0, max);
}

export function analyzeFile(name: string, buf: ArrayBuffer): FileReport {
  const b = new Uint8Array(buf);
  const magic = matchMagic(b);
  const head = b.slice(0, 24);
  const hex = [...head].map((x) => x.toString(16).padStart(2, "0")).join(" ");
  const ent = entropy(b.slice(0, 65536));
  const all = extractStrings(b, 6, 200);
  const flagSet = new Set<string>();
  const whole = new TextDecoder("latin1").decode(b.slice(0, 2_000_000));
  for (const m of whole.matchAll(FLAG_RE_G)) { const f = looksLikeFlag(m[0]); if (f) flagSet.add(m[0]); }
  const interesting = all.filter((s) => FLAG_RE.test(s) || /flag|password|secret|key|token|admin/i.test(s)).slice(0, 30);
  const labels: string[] = [];
  if (magic) labels.push("File magic: " + magic);
  if (ent > 7.3) labels.push("High entropy");
  const suggestions = suggestFor(labels.length ? labels : ["Binary data"]);
  // if textual, also run text analysis
  let text: TextReport | undefined;
  const printable = [...b.slice(0, 4096)].filter((x) => (x >= 32 && x < 127) || x === 10 || x === 9 || x === 13).length / Math.min(b.length, 4096);
  if (b.length < 200000 && printable > 0.9) text = analyzeText(whole.slice(0, 20000));
  return { name, size: b.length, entropy: ent, magic, hex, strings: interesting, flags: [...flagSet].slice(0, 20), suggestions, text };
}
