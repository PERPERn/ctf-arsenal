"use client";
import { useApp } from "./providers";
import { Identify } from "./Identify";
import { Icon } from "./icons";

export function IdentifyPage() {
  const { lang } = useApp();
  const L = (th: string, en: string) => (lang === "th" ? th : en);
  const feats = [
    { i: "fingerprint", th: "ระบุแฮช เข้ารหัส cipher และชนิดไฟล์จาก magic bytes", en: "Identifies hashes, encodings, ciphers and file types from magic bytes" },
    { i: "terminal", th: "ถอดเป็นชั้น ๆ อัตโนมัติ (base64 › hex › xor …) จนเจอ flag", en: "Auto-decodes in layers (base64 › hex › xor …) until it finds a flag" },
    { i: "shield", th: "ถอด JWT ให้ พร้อมเตือนช่องโหว่ alg:none / secret อ่อน", en: "Decodes JWTs and flags alg:none / weak-secret risks" },
    { i: "lock", th: "ทำงานในเบราว์เซอร์ล้วน ไฟล์ไม่ถูกส่งขึ้นเซิร์ฟเวอร์", en: "Runs fully in-browser — files never leave your device" },
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="border-b hairline pb-6">
        <div className="mono inline-flex items-center gap-2 text-brand text-sm"><Icon name="search" size={18} /> identify</div>
        <h1 className="mt-2 text-3xl font-bold">{L("วางอะไรก็ได้ เดี๋ยวบอกให้", "Paste anything, get an answer")}</h1>
        <p className="mt-2 text-muted">{L("ข้อความ แฮช สตริงมั่ว ๆ หรือไฟล์/รูป — ระบุ + ถอด + บอก tool ที่ใช้แก้ต่อ", "Text, a hash, a mystery string, or a file/image — identify, decode, and get the next tool.")}</p>
      </div>
      <div className="mt-6"><Identify /></div>
      <div className="mt-8 grid sm:grid-cols-2 gap-3">
        {feats.map((f, i) => (
          <div key={i} className="flex items-start gap-3 rounded-md border hairline bg-card p-3.5">
            <Icon name={f.i} size={18} className="text-brand shrink-0 mt-0.5" />
            <p className="text-sm text-muted">{L(f.th, f.en)}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 mono text-center text-xs text-muted">{L("// เอนจินพอร์ตจาก ctfid (CLI ที่เขียนขึ้นเอง)", "// engine ported from ctfid, our own CLI")}</p>
    </div>
  );
}
