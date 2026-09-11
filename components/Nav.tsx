"use client";
import Link from "next/link";
import { useApp } from "./providers";
import { ui } from "@/lib/i18n";
import { Icon } from "./icons";

export function Nav() {
  const { lang, toggleLang, theme, toggleTheme } = useApp();
  const link = "px-3 py-2 rounded-md text-muted hover:text-fg hover:bg-surface transition text-sm";
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-bg/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center gap-4 h-14">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="grid place-items-center h-8 w-8 rounded-md border border-brand/40 text-brand bg-brand/10 group-hover:bg-brand/15 transition">
            <Icon name="prompt" size={18} />
          </span>
          <span className="mono font-bold tracking-tight text-[15px]">ctf<span className="accent-text">/</span>arsenal</span>
        </Link>
        <nav className="hidden md:flex items-center gap-0.5 ml-3">
          <Link href="/" className={link}>{ui.home[lang]}</Link>
          <Link href="/#tools" className={link}>{lang === "th" ? "เครื่องมือ" : "Tools"}</Link>
          <Link href="/identify" className={link}>Identify</Link>
          <Link href="/guides" className={link}>{ui.guidesNav[lang]}</Link>
          <Link href="/about" className={link}>{ui.aboutNav[lang]}</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/identify" className="md:hidden text-sm px-2.5 py-1.5 rounded-md text-brand hover:bg-brand/10">Identify</Link>
          <button onClick={toggleLang} aria-label="language"
            className="mono px-2.5 py-1.5 rounded-md border hairline text-xs font-bold hover:border-brand hover:text-brand transition">
            {lang === "th" ? "TH" : "EN"}
          </button>
          <button onClick={toggleTheme} aria-label="theme"
            className="grid place-items-center h-8 w-8 rounded-md border hairline text-muted hover:text-brand hover:border-brand transition">
            <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
