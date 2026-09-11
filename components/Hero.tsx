"use client";
import Link from "next/link";
import { ui } from "@/lib/i18n";
import { useApp } from "./providers";
import { Identify } from "./Identify";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";

export function Hero() {
  const { lang } = useApp();
  const stats = [
    { n: tools.length, l: { th: "เครื่องมือ", en: "tools" } },
    { n: categories.length, l: { th: "หมวดหมู่", en: "categories" } },
    { n: tools.filter((t) => t.demo).length, l: { th: "เดโมสด", en: "live demos" } },
    { n: 2, l: { th: "ภาษา", en: "languages" } },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-glow" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-12 sm:pt-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border bg-card/60 text-muted animate-fade-up">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {lang === "th" ? "คลังเครื่องมือ + คู่มือสองภาษา + เดโมสด" : "Tools · bilingual guides · live demos"}
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight animate-fade-up leading-[1.05]">
            <span className="gradient-text">{ui.heroTitle[lang]}</span>
          </h1>
          <p className="mt-5 text-lg text-muted max-w-2xl animate-fade-up">{ui.heroSub[lang]}</p>
          <div className="mt-7 flex flex-wrap gap-3 animate-fade-up">
            <Link href="#tools" className="px-5 py-3 rounded-xl bg-brand text-white font-semibold shadow-glow hover:brightness-110 transition">
              {lang === "th" ? "สำรวจเครื่องมือ" : "Explore tools"} →
            </Link>
            <Link href="/identify" className="px-5 py-3 rounded-xl border font-semibold hover:border-brand hover:text-brand transition">
              🔎 {lang === "th" ? "ลอง Identify" : "Try Identify"}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-4 max-w-lg animate-fade-up">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-2xl sm:text-3xl font-black gradient-text tabular-nums">{s.n}</div>
                <div className="text-xs text-muted">{s.l[lang]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* live identify panel */}
        <div className="mt-12 grid lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3 animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔎</span>
              <h2 className="font-bold text-lg">{lang === "th" ? "วางอะไรก็ได้ เดี๋ยวบอกให้ว่าคืออะไร" : "Paste anything — we'll tell you what it is"}</h2>
            </div>
            <Identify compact />
          </div>
          <div className="lg:col-span-2 animate-fade-up">
            <div className="rounded-2xl border bg-card p-5 h-full">
              <div className="text-sm font-semibold mb-3">{lang === "th" ? "ลองเลย:" : "Try it:"}</div>
              <ul className="space-y-2 text-sm">
                {[
                  { t: "Q1RUe2g5fQ==", d: { th: "base64", en: "base64" } },
                  { t: "5d41402abc4b2a76b9719d911017c592", d: { th: "MD5 hash", en: "MD5 hash" } },
                  { t: "-.-. - -", d: { th: "morse", en: "morse" } },
                  { t: "01000011 01010100 01010100", d: { th: "binary", en: "binary" } },
                ].map((ex) => (
                  <li key={ex.t} className="flex items-center gap-2 justify-between rounded-lg border px-3 py-2 bg-surface">
                    <code className="text-xs truncate text-brand2">{ex.t}</code>
                    <span className="text-[11px] text-muted shrink-0">{ex.d[lang]}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted mt-3">{lang === "th" ? "หรือลากไฟล์/รูปมาวางในกล่องด้านซ้าย" : "Or drop a file / image into the box on the left."}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
