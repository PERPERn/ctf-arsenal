"use client";
import { useApp } from "./providers";
import { Identify } from "./Identify";

export function IdentifyPage() {
  const { lang } = useApp();
  const L = (th: string, en: string) => (lang === "th" ? th : en);
  const feats = [
    { i: "🧬", th: "ระบุแฮช เข้ารหัส cipher และชนิดไฟล์จาก magic bytes", en: "Identifies hashes, encodings, ciphers and file types from magic bytes" },
    { i: "🔗", th: "ถอดเป็นชั้น ๆ อัตโนมัติ (base64 › hex › xor …) จนเจอ flag", en: "Auto-decodes in layers (base64 › hex › xor …) until it finds a flag" },
    { i: "🛠️", th: "บอกว่าถ้าจะแก้ต่อควรใช้ tool ไหน", en: "Tells you which tool to reach for next" },
    { i: "🔒", th: "ทำงานในเบราว์เซอร์ล้วน ไฟล์ไม่ถูกส่งขึ้นเซิร์ฟเวอร์", en: "Runs fully in-browser — files never leave your device" },
  ];
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black gradient-text">🔎 Identify</h1>
        <p className="mt-3 text-muted max-w-2xl mx-auto">{L("วางข้อความ แฮช สตริงมั่ว ๆ หรือลากไฟล์/รูปมาวาง แล้วปล่อยให้มันบอกว่าคืออะไรและถอดให้", "Paste text, a hash, a mystery string, or drop a file / image — and let it identify and decode.")}</p>
      </div>
      <div className="mt-8"><Identify /></div>
      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        {feats.map((f, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border bg-card p-4">
            <span className="text-2xl">{f.i}</span>
            <p className="text-sm text-muted">{L(f.th, f.en)}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted">{L("เอนจินนี้พอร์ตมาจาก ctfid (เครื่องมือคอมมานด์ไลน์ที่เขียนขึ้นเอง)", "This engine is ported from ctfid, our command-line tool.")}</p>
    </div>
  );
}
