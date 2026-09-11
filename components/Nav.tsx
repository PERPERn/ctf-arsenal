"use client";
import Link from "next/link";
import { useApp } from "./providers";
import { ui } from "@/lib/i18n";

export function Nav() {
  const { lang, toggleLang, theme, toggleTheme } = useApp();
  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center gap-4 h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-brand to-brand2 text-white shadow-glow">⚔️</span>
          <span className="hidden sm:inline gradient-text">CTF Arsenal</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm ml-2">
          <Link href="/" className="px-3 py-2 rounded-lg hover:bg-surface text-muted hover:text-fg transition">{ui.home[lang]}</Link>
          <Link href="/#tools" className="px-3 py-2 rounded-lg hover:bg-surface text-muted hover:text-fg transition">{ui.tools[lang] === "tools" ? "Tools" : "เครื่องมือ"}</Link>
          <Link href="/identify" className="px-3 py-2 rounded-lg hover:bg-surface text-muted hover:text-fg transition">Identify</Link>
          <Link href="/guides" className="px-3 py-2 rounded-lg hover:bg-surface text-muted hover:text-fg transition">{ui.guidesNav[lang]}</Link>
          <Link href="/about" className="px-3 py-2 rounded-lg hover:bg-surface text-muted hover:text-fg transition">{ui.aboutNav[lang]}</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/identify" className="md:hidden px-3 py-1.5 rounded-lg bg-brand/15 text-brand text-sm font-medium">Identify</Link>
          <button onClick={toggleLang} aria-label="language"
            className="px-3 py-1.5 rounded-lg border text-sm font-semibold hover:border-brand hover:text-brand transition tabular-nums">
            {lang === "th" ? "TH" : "EN"}
          </button>
          <button onClick={toggleTheme} aria-label="theme"
            className="grid place-items-center h-9 w-9 rounded-lg border hover:border-brand transition">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
