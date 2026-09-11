"use client";
import Link from "next/link";
import { useApp } from "./providers";
import { ui } from "@/lib/i18n";

export function Footer() {
  const { lang } = useApp();
  return (
    <footer className="border-t mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-brand to-brand2 text-white">⚔️</span>
            <span className="gradient-text">CTF Arsenal</span>
          </div>
          <p className="text-sm text-muted mt-3 max-w-xs">{ui.tagline[lang]}</p>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-3">{ui.tools[lang] === "tools" ? "Explore" : "สำรวจ"}</div>
          <ul className="space-y-2 text-muted">
            <li><Link href="/#tools" className="hover:text-brand">{ui.categories[lang]}</Link></li>
            <li><Link href="/identify" className="hover:text-brand">Identify</Link></li>
            <li><Link href="/guides" className="hover:text-brand">{ui.guidesNav[lang]}</Link></li>
            <li><Link href="/about" className="hover:text-brand">{ui.aboutNav[lang]}</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-3">{ui.deployTitle[lang]}</div>
          <p className="text-muted">Next.js · Vercel · Render</p>
          <p className="text-xs text-muted mt-4 flex items-start gap-1.5">
            <span>⚠️</span><span>{ui.disclaimer[lang]}</span>
          </p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} CTF Arsenal · {ui.builtWith[lang]} Next.js + Tailwind
      </div>
    </footer>
  );
}
