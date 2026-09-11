"use client";
import Link from "next/link";
import type { Tool } from "@/lib/types";
import { categoryMap } from "@/lib/categories";
import { useApp } from "./providers";

const diffLabel = ["", "★", "★★", "★★★"];

export function ToolCard({ tool }: { tool: Tool }) {
  const { lang } = useApp();
  const cat = categoryMap[tool.category];
  return (
    <Link href={`/tools/${tool.id}`}
      className="card-hover group relative flex flex-col rounded-2xl border bg-card p-5 overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${cat?.color}0d, transparent 55%)` }}>
      <span className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full" style={{ background: cat?.color }} />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition"
        style={{ background: cat?.color }} />
      <div className="flex items-start gap-3">
        <span className="grid place-items-center h-11 w-11 rounded-xl text-xl shrink-0 border"
          style={{ background: `${cat?.color}1a`, borderColor: `${cat?.color}40` }}>{cat?.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold truncate">{tool.name}</h3>
            {tool.installed && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 font-semibold shrink-0">✓</span>}
          </div>
          <div className="text-xs text-muted">{cat?.name[lang]}</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted line-clamp-2 flex-1">{tool.tagline[lang]}</p>
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {tool.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand/15 text-brand font-semibold">{lang === "th" ? "แนะนำ" : "Featured"}</span>}
        {tool.demo && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand2/15 text-brand2 font-semibold">▶ demo</span>}
        <span className="ml-auto text-xs text-amber-400 tabular-nums" title="difficulty">{diffLabel[tool.difficulty]}</span>
      </div>
    </Link>
  );
}
