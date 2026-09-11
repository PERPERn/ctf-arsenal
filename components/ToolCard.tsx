"use client";
import Link from "next/link";
import type { Tool } from "@/lib/types";
import { categoryMap } from "@/lib/categories";
import { useApp } from "./providers";
import { Icon, catIconName } from "./icons";

export function ToolCard({ tool }: { tool: Tool }) {
  const { lang } = useApp();
  const cat = categoryMap[tool.category];
  return (
    <Link href={`/tools/${tool.id}`}
      className="card-hover group relative flex flex-col rounded-lg border hairline bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="grid place-items-center h-10 w-10 rounded-md border hairline text-muted group-hover:text-brand group-hover:border-brand/50 transition shrink-0">
          <Icon name={catIconName(tool.category)} size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="mono font-semibold truncate">{tool.name}</h3>
            {tool.installed && <Icon name="check" size={13} className="text-ok shrink-0" />}
          </div>
          <div className="mono text-[11px] uppercase tracking-wider text-muted/80">{cat?.name[lang]}</div>
        </div>
        <Icon name="chevronRight" size={16} className="text-muted/40 group-hover:text-brand group-hover:translate-x-0.5 transition shrink-0" />
      </div>
      <p className="mt-2.5 text-sm text-muted line-clamp-2 flex-1">{tool.tagline[lang]}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px]">
        {tool.featured && <span className="mono px-1.5 py-0.5 rounded border border-brand/30 text-brand">featured</span>}
        {tool.demo && <span className="mono px-1.5 py-0.5 rounded border hairline text-muted flex items-center gap-1"><Icon name="play" size={9} />demo</span>}
        <span className="ml-auto mono text-muted/70" title="difficulty">{"◆".repeat(tool.difficulty)}<span className="text-muted/25">{"◆".repeat(3 - tool.difficulty)}</span></span>
      </div>
    </Link>
  );
}
