"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Lang } from "@/lib/types";

type Theme = "light" | "dark";
interface Ctx { lang: Lang; setLang: (l: Lang) => void; theme: Theme; setTheme: (t: Theme) => void; toggleLang: () => void; toggleTheme: () => void; }
const AppCtx = createContext<Ctx | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("th");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const l = localStorage.getItem("lang") as Lang | null;
      const t = localStorage.getItem("theme") as Theme | null;
      if (l) setLang(l);
      setTheme(t === "light" ? "light" : "dark");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch {}
  }, [lang]);

  const value: Ctx = {
    lang, setLang, theme, setTheme,
    toggleLang: () => setLang((p) => (p === "th" ? "en" : "th")),
    toggleTheme: () => setTheme((p) => (p === "dark" ? "light" : "dark")),
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used within Providers");
  return c;
}
