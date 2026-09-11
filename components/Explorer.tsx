"use client";
import { useMemo, useState } from "react";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";
import { ui } from "@/lib/i18n";
import { useApp } from "./providers";
import { ToolCard } from "./ToolCard";
import { Icon, catIconName } from "./icons";

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
      return [t.name, t.tagline.th, t.tagline.en, t.description.th, t.description.en, ...t.tags, t.category].join(" ").toLowerCase().includes(needle);
    });
  }, [q, filter]);

  const chip = (id: Filter, label: string, icon?: string) => {
    const on = filter === id;
    return (
      <button key={id} onClick={() => setFilter(id)}
        className={`shrink-0 mono text-[13px] px-3 py-1.5 rounded-md border transition flex items-center gap-1.5 ${on ? "bg-brand/15 text-brand border-brand/50" : "bg-card hairline text-muted hover:text-fg hover:border-muted/40"}`}>
        {icon && <Icon name={icon} size={14} />}{label}
        <span className={`text-[11px] ${on ? "text-brand/70" : "text-muted/60"}`}>{counts[id] ?? 0}</span>
      </button>
    );
  };

  return (
    <section id="tools" className="mx-auto max-w-7xl px-4 sm:px-6 scroll-mt-16">
      <div className="sticky top-14 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-bg/90 backdrop-blur-md border-b hairline">
        <div className="relative">
          <Icon name="search" size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={ui.searchPlaceholder[lang]} spellCheck={false}
            className="w-full pl-10 pr-4 py-2.5 rounded-md border hairline bg-card outline-none focus:border-brand transition text-sm mono" />
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 thin-scroll">
          {chip("all", ui.allTools[lang])}
          {chip("featured", ui.featured[lang], "star")}
          {chip("installed", ui.installed[lang], "check")}
          <span className="w-px bg-border mx-1 shrink-0" />
          {categories.map((c) => chip(c.id, c.name[lang], catIconName(c.id)))}
        </div>
      </div>
      <div className="mt-6">
        {list.length === 0 ? (
          <div className="text-center py-20 text-muted mono">{ui.noResults[lang]}</div>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">{list.map((t) => <ToolCard key={t.id} tool={t} />)}</div>
        )}
      </div>
    </section>
  );
}
