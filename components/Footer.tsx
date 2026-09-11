"use client";
import Link from "next/link";
import { useApp } from "./providers";
import { ui } from "@/lib/i18n";
import { Icon } from "./icons";

export function Footer() {
  const { lang } = useApp();
  return (
    <footer className="border-t hairline mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mono font-bold">
            <span className="grid place-items-center h-7 w-7 rounded-md border border-brand/40 text-brand bg-brand/10"><Icon name="prompt" size={15} /></span>
            ctf<span className="accent-text">/</span>arsenal
          </div>
          <p className="text-sm text-muted mt-3 max-w-xs leading-relaxed">{ui.tagline[lang]}</p>
        </div>
        <div className="text-sm">
          <div className="mono text-xs uppercase tracking-widest text-muted mb-3">{lang === "th" ? "สำรวจ" : "Explore"}</div>
          <ul className="space-y-2 text-muted">
            <li><Link href="/#tools" className="hover:text-brand">{ui.categories[lang]}</Link></li>
            <li><Link href="/identify" className="hover:text-brand">Identify</Link></li>
            <li><Link href="/guides" className="hover:text-brand">{ui.guidesNav[lang]}</Link></li>
            <li><Link href="/about" className="hover:text-brand">{ui.aboutNav[lang]}</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mono text-xs uppercase tracking-widest text-muted mb-3">{ui.deployTitle[lang]}</div>
          <p className="text-muted mono text-xs">Next.js · Vercel · Render · Pages</p>
          <p className="text-xs text-muted mt-4 flex items-start gap-1.5">
            <Icon name="shield" size={15} className="shrink-0 mt-px text-brand" /><span>{ui.disclaimer[lang]}</span>
          </p>
        </div>
      </div>
      <div className="border-t hairline py-4 text-center text-xs text-muted mono">
        © {new Date().getFullYear()} ctf/arsenal · {ui.builtWith[lang]} Next.js + Tailwind
      </div>
    </footer>
  );
}
