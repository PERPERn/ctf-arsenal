"use client";
import { useApp } from "./providers";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";
import { Icon } from "./icons";

export function AboutPage() {
  const { lang } = useApp();
  const L = (th: string, en: string) => (lang === "th" ? th : en);
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="mono text-3xl font-bold">ctf<span className="accent-text">/</span>arsenal</h1>
      <div className="mt-6 space-y-5 text-[15px] leading-7">
        <p>{L(`คลังเครื่องมือ Cybersecurity และ CTF ${tools.length} ตัวใน ${categories.length} หมวด แต่ละตัวมีคู่มือสองภาษา (ลิงก์ต้นฉบับ + โน้ตที่เราเขียนเอง) และเดโมเทอร์มินัลที่เล่นได้`,
          `A cybersecurity & CTF toolbox of ${tools.length} tools across ${categories.length} categories — each with a bilingual guide (official links plus our own notes) and a playable terminal demo.`)}</p>
        <div className="rounded-md border hairline bg-card p-4">
          <h2 className="mono font-semibold mb-2 flex items-center gap-2"><Icon name="search" size={16} className="text-brand" /> {L("Identify ในเบราว์เซอร์", "In-browser Identify")}</h2>
          <p className="text-sm text-muted">{L("วางข้อความหรืออัปโหลดไฟล์/รูป แล้วระบุ + ถอดรหัสในเครื่องคุณ ไม่อัปโหลดไปไหน เอนจินพอร์ตจาก ctfid", "Paste text or upload a file/image; it identifies + decodes on your device, nothing uploaded. Engine ported from our ctfid CLI.")}</p>
        </div>
        <div className="rounded-md border-l-2 border-brand bg-brand/5 p-4 flex items-start gap-2">
          <Icon name="shield" size={16} className="text-brand shrink-0 mt-0.5" />
          <p className="text-sm">{L("ใช้เพื่อการศึกษาและการทดสอบที่ได้รับอนุญาตเท่านั้น", "For education and authorised testing only.")}</p>
        </div>
        <div>
          <h2 className="mono font-semibold mb-2">{L("นำไปรันเอง", "Run your own")}</h2>
          <p className="text-sm text-muted">{L("Next.js deploy ได้ทั้ง Vercel, Render และ GitHub Pages — ดู README", "Next.js — deploys to Vercel, Render and GitHub Pages. See the README.")}</p>
        </div>
      </div>
    </div>
  );
}
