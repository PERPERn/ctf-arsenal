"use client";
import { useMemo, useState } from "react";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";
import { ui } from "@/lib/i18n";
import { useApp } from "./providers";
import { ToolCard } from "./ToolCard";

type Filter = "all" | "featured" | "installed" | string;

export function Explorer() {
  const { lang } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: tools.length, featured: tools.filter((t) => t.featured).length, installed: tools.filter((t) => t.installed).length };
    for (const c of categories) m[c.id] = tools.filter((t) => t.category === c.id).length;
    return m;
  }, []);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return tools.filter((t) => {
      if (filter === "featured" && !t.featured) return false;
      if (filter === "installed" && !t.installed) return false;
      if (filter !== "all" && filter !== "featured" && filter !== "installed" && t.category !== filter) return false;
      if (!needle) return true;
      const hay = [t.name, t.tagline.th, t.tagline.en, t.description.th, t.description.en, ...t.tags, t.category].join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [q, filter]);

  const chip = (id: Filter, label: string, icon?: string) => (
    <button key={id} onClick={() => setFilter(id)}
      className={`shrink-0 text-sm px-3.5 py-2 rounded-xl border transition flex items-center gap-1.5 ${filter === id ? "bg-brand text-white border-brand shadow-glow" : "bg-card hover:border-brand/60 text-muted hover:text-fg"}`}>
      {icon && <span>{icon}</span>}{label}
      <span className={`text-[11px] tabular-nums ${filter === id ? "text-white/70" : "text-muted"}`}>{counts[id] ?? 0}</span>
    </button>
  );

  return (
    <section id="tools" className="mx-auto max-w-7xl px-4 sm:px-6 scroll-mt-20">
      <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 glass border-b">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">🔍</span>
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={ui.searchPlaceholder[lang]}
            className="w-full pl-11 pr-4 py-3 rounded-xl border bg-card outline-none focus:border-brand transition text-sm"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 terminal-scroll">
          {chip("all", ui.allTools[lang])}
          {chip("featured", ui.featured[lang], "⭐")}
          {chip("installed", ui.installed[lang], "✓")}
          <span className="w-px bg-border mx-1 shrink-0" />
          {categories.map((c) => chip(c.id, c.name[lang], c.icon))}
        </div>
      </div>

      <div className="mt-6">
        {list.length === 0 ? (
          <div className="text-center py-20 text-muted">{ui.noResults[lang]}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        )}
      </div>
    </section>
  );
}
