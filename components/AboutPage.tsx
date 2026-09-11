"use client";
import { useApp } from "./providers";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";

export function AboutPage() {
  const { lang } = useApp();
  const L = (th: string, en: string) => (lang === "th" ? th : en);
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-black gradient-text">{L("เกี่ยวกับ CTF Arsenal", "About CTF Arsenal")}</h1>
      <div className="mt-6 space-y-5 text-[15px] leading-7">
        <p>{L(
          `คลังเครื่องมือ Cybersecurity และ CTF ที่รวม ${tools.length} เครื่องมือใน ${categories.length} หมวด แต่ละตัวมีคู่มือสองภาษา (ไทย/อังกฤษ) ทั้งลิงก์เอกสารต้นฉบับและคำอธิบาย/โน้ตที่เราเขียนขึ้นเอง พร้อมเดโมเทอร์มินัลที่เล่นได้`,
          `A cybersecurity & CTF toolbox gathering ${tools.length} tools across ${categories.length} categories. Each has a bilingual (Thai/English) guide — official documentation links plus our own notes — and a playable terminal demo.`)}</p>
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-bold mb-2">🔎 {L("จุดเด่น: Identify ในเบราว์เซอร์", "Highlight: in-browser Identify")}</h2>
          <p className="text-sm text-muted">{L("วางข้อความหรืออัปโหลดไฟล์/รูป แล้วระบบระบุ + ถอดรหัสให้ทันทีในเครื่องคุณ ไม่มีการอัปโหลดไปเซิร์ฟเวอร์ เอนจินพอร์ตจาก ctfid ที่เขียนขึ้นเอง", "Paste text or upload a file/image and it identifies + decodes instantly on your device, nothing uploaded. The engine is ported from our own ctfid CLI.")}</p>
        </div>
        <div className="rounded-xl border-l-4 border-amber-400 bg-amber-400/5 p-4">
          <p className="text-sm">⚠️ {L("ใช้เพื่อการศึกษาและการทดสอบที่ได้รับอนุญาตเท่านั้น อย่านำไปโจมตีระบบที่ไม่ได้รับอนุญาต", "For education and authorised testing only. Do not attack systems you are not authorised to test.")}</p>
        </div>
        <div>
          <h2 className="font-bold mb-2">🚀 {L("นำไปรันเอง", "Run your own")}</h2>
          <p className="text-sm text-muted">{L("โปรเจกต์นี้เป็น Next.js deploy ได้ทั้ง Vercel และ Render — ดูวิธีใน README", "This is a Next.js project that deploys to both Vercel and Render — see the README for steps.")}</p>
        </div>
      </div>
    </div>
  );
}
