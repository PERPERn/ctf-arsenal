"use client";
import Link from "next/link";
import { ui } from "@/lib/i18n";
import { useApp } from "./providers";
import { Identify } from "./Identify";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";
import { Icon } from "./icons";

export function Hero() {
  const { lang } = useApp();
  const stats = [
    { n: tools.length, l: { th: "เครื่องมือ", en: "tools" } },
    { n: categories.length, l: { th: "หมวดหมู่", en: "categories" } },
    { n: tools.filter((t) => t.demo).length, l: { th: "เดโมสด", en: "demos" } },
    { n: 2, l: { th: "ภาษา", en: "langs" } },
  ];
  return (
    <section className="relative overflow-hidden border-b hairline">
      <div className="absolute inset-0 bg-dots opacity-60" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-12 sm:pt-20">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* left: copy */}
          <div className="lg:col-span-6">
            <div className="mono inline-flex items-center gap-2 text-[12px] px-2.5 py-1 rounded border hairline text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
              {tools.length} tools · TH/EN · live demos
            </div>
            <h1 className="mt-5 text-[2.6rem] sm:text-6xl font-extrabold tracking-tight leading-[1.02]">
              {lang === "th" ? <>เครื่องมือแฮ็ก<br /><span className="accent-text">รวมไว้ที่เดียว</span></> : <>The hacker's<br /><span className="accent-text">toolbox</span>, indexed</>}
            </h1>
            <p className="mt-5 text-[15px] sm:text-base text-muted max-w-lg leading-relaxed">{ui.heroSub[lang]}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#tools" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-brand text-black font-semibold text-sm hover:brightness-105 transition">
                {lang === "th" ? "สำรวจเครื่องมือ" : "Browse tools"} <Icon name="arrowRight" size={16} />
              </Link>
              <Link href="/identify" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border hairline font-semibold text-sm hover:border-brand hover:text-brand transition">
                <Icon name="search" size={15} /> Identify
              </Link>
            </div>
            <div className="mt-9 grid grid-cols-4 gap-4 max-w-md border-t hairline pt-5">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="mono text-2xl sm:text-3xl font-bold accent-text tabular-nums">{s.n}</div>
                  <div className="mono text-[11px] uppercase tracking-wider text-muted mt-0.5">{s.l[lang]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right: identify as a terminal window */}
          <div className="lg:col-span-6">
            <div className="rounded-lg border hairline overflow-hidden bg-card shadow-sm">
              <div className="flex items-center gap-2 h-9 px-3 border-b hairline bg-surface">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="mono text-[11px] text-muted ml-1.5">identify — paste or drop</span>
              </div>
              <div className="p-4">
                <Identify compact />
              </div>
            </div>
            <p className="mono text-[11px] text-muted mt-2 pl-1">{lang === "th" ? "// ทำงานในเบราว์เซอร์ ไฟล์ไม่ถูกอัปโหลด" : "// runs in-browser, nothing uploaded"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
