// In-browser RSA attacker. Handles the weak-RSA setups common in CTFs:
// factorable n (trial division + Pollard's rho), close primes (Fermat), and
// small-e no-padding cube roots. All BigInt, so it runs client-side.

export interface RsaInput { n?: bigint; e?: bigint; c?: bigint; }
export interface RsaResult {
  ok: boolean;
  method?: string;
  p?: bigint; q?: bigint; d?: bigint;
  plaintextDec?: string; plaintextHex?: string; plaintextText?: string;
  error?: string;
}

const parseNum = (raw: string): bigint | null => {
  const s = raw.trim().replace(/[_\s]/g, "");
  try {
    if (/^0x[0-9a-f]+$/i.test(s)) return BigInt(s);
    if (/^[0-9a-f]+$/i.test(s) && /[a-f]/i.test(s) && s.length % 2 === 0) return BigInt("0x" + s);
    if (/^\d+$/.test(s)) return BigInt(s);
    return null;
  } catch { return null; }
};

export function parseRSA(text: string): RsaInput {
  const out: RsaInput = {};
  const grab = (labels: string[]) => {
    for (const l of labels) {
      const m = text.match(new RegExp(`\\b${l}\\s*[=:]\\s*([0-9a-fA-Fx_]+)`, "i"));
      if (m) { const v = parseNum(m[1]); if (v != null) return v; }
    }
    return undefined;
  };
  out.n = grab(["n", "modulus"]);
  out.e = grab(["e", "exponent"]);
  out.c = grab(["c", "ct", "ciphertext", "cipher"]);
  return out;
}

export function looksLikeRSA(text: string): boolean {
  return /\bn\s*[=:]/i.test(text) && /\be\s*[=:]/i.test(text);
}

// ── number theory ──
function egcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
  if (b === 0n) return [a, 1n, 0n];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - (a / b) * y];
}
function modinv(a: bigint, m: bigint): bigint | null {
  const [g, x] = egcd(((a % m) + m) % m, m);
  return g === 1n ? ((x % m) + m) % m : null;
}
function modpow(b: bigint, e: bigint, m: bigint): bigint {
  b %= m; let r = 1n;
  while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n; }
  return r;
}
function gcd(a: bigint, b: bigint): bigint { while (b) { [a, b] = [b, a % b]; } return a < 0n ? -a : a; }
function abs(x: bigint) { return x < 0n ? -x : x; }
function isqrt(n: bigint): bigint {
  if (n < 0n) return -1n;
  if (n < 2n) return n;
  let x = n, y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + n / x) / 2n; }
  return x;
}

function pollardRho(n: bigint, budget = 400000): bigint | null {
  if (n % 2n === 0n) return 2n;
  for (let c = 1n; c < 20n; c++) {
    let x = 2n, y = 2n, d = 1n, i = 0;
    const f = (v: bigint) => (v * v + c) % n;
    while (d === 1n && i++ < budget) { x = f(x); y = f(f(y)); d = gcd(abs(x - y), n); }
    if (d !== 1n && d !== n) return d;
  }
  return null;
}

function fermat(n: bigint, budget = 200000): [bigint, bigint] | null {
  let a = isqrt(n); if (a * a < n) a += 1n;
  for (let i = 0; i < budget; i++, a++) {
    const b2 = a * a - n;
    const b = isqrt(b2);
    if (b * b === b2) return [a - b, a + b];
  }
  return null;
}

function factor(n: bigint): [bigint, bigint] | null {
  // small primes first
  for (const p of [2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n,41n,43n,47n]) if (n % p === 0n) return [p, n / p];
  const fe = fermat(n, 60000); if (fe) return fe;        // close primes
  const d = pollardRho(n); if (d) return [d, n / d];      // general
  return null;
}

function bigToBytes(x: bigint): Uint8Array {
  let hex = x.toString(16); if (hex.length % 2) hex = "0" + hex;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}
const bytesToText = (b: Uint8Array) => new TextDecoder("utf-8", { fatal: false }).decode(b);

function icbrt(n: bigint): bigint {
  if (n < 2n) return n;
  let lo = 0n, hi = 1n;
  while (hi * hi * hi <= n) hi <<= 1n;
  while (lo < hi) { const mid = (lo + hi + 1n) >> 1n; if (mid * mid * mid <= n) lo = mid; else hi = mid - 1n; }
  return lo;
}

export function solveRSA({ n, e, c }: RsaInput): RsaResult {
  if (!n || !e) return { ok: false, error: "need at least n and e" };
  try {
    // small-e cube root (no padding), independent of factoring
    if (c && e <= 5n) {
      const r = icbrt(c);
      if (r ** e === c) {
        const bytes = bigToBytes(r);
        return { ok: true, method: `small-e (e=${e}) ${e}th-root of c`, plaintextDec: r.toString(), plaintextHex: r.toString(16), plaintextText: bytesToText(bytes) };
      }
    }
    const f = factor(n);
    if (!f) return { ok: false, error: "could not factor n (too large for in-browser). Try factordb.com or RsaCtfTool." };
    const [p, q] = f;
    const phi = (p - 1n) * (q - 1n);
    const d = modinv(e, phi);
    if (d == null) return { ok: false, p, q, error: "e not invertible mod phi" };
    const res: RsaResult = { ok: true, method: p === q ? "n = p²" : "factored n (p·q)", p, q, d };
    if (c) {
      const m = modpow(c, d, n);
      res.plaintextDec = m.toString();
      res.plaintextHex = m.toString(16);
      res.plaintextText = bytesToText(bigToBytes(m));
    }
    return res;
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
