"use client";
import Link from "next/link";
import { useState } from "react";
import type { Tool } from "@/lib/types";
import { categoryMap } from "@/lib/categories";
import { ui } from "@/lib/i18n";
import { useApp } from "./providers";
import { Terminal } from "./Terminal";
import { CodeLine } from "./CodeLine";
import { ToolCard } from "./ToolCard";
import { Icon, catIconName } from "./icons";

export function ToolDetail({ tool, related }: { tool: Tool; related: Tool[] }) {
  const { lang } = useApp();
  const cat = categoryMap[tool.category];
  const tabs = [
    tool.demo && { id: "demo", label: ui.demo[lang], icon: "play" },
    { id: "overview", label: ui.overview[lang], icon: "book" },
    tool.install && { id: "install", label: ui.install[lang], icon: "download" },
    tool.usage && { id: "usage", label: ui.usage[lang], icon: "keyboard" },
    tool.cheatsheet && { id: "cheatsheet", label: ui.cheatsheet[lang], icon: "terminal" },
  ].filter(Boolean) as { id: string; label: string; icon: string }[];
  const [tab, setTab] = useState(tabs[0].id);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <Link href="/#tools" className="mono inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand transition"><Icon name="arrowLeft" size={15} /> {ui.back[lang]}</Link>

      <header className="mt-4 flex items-start gap-4">
        <span className="grid place-items-center h-14 w-14 rounded-md border hairline text-brand shrink-0"><Icon name={catIconName(tool.category)} size={26} /></span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="mono text-3xl font-bold">{tool.name}</h1>
            {tool.installed && <span className="mono text-xs px-2 py-0.5 rounded border border-ok/40 text-ok flex items-center gap-1"><Icon name="check" size={12} /> {ui.installed[lang]}</span>}
            {tool.featured && <span className="mono text-xs px-2 py-0.5 rounded border border-brand/40 text-brand">featured</span>}
          </div>
          <p className="mt-1 text-muted">{tool.tagline[lang]}</p>
          <div className="mt-2 flex items-center gap-3 mono text-xs text-muted flex-wrap">
            <span className="uppercase tracking-wider">{cat?.name[lang]}</span>
            <span className="text-brand" title="difficulty">{"◆".repeat(tool.difficulty)}<span className="text-muted/30">{"◆".repeat(3 - tool.difficulty)}</span></span>
            {tool.platforms && <span>{tool.platforms.join(" · ")}</span>}
          </div>
        </div>
      </header>

      <div className="mt-4 flex gap-2 flex-wrap">
        {tool.official && <a href={tool.official} target="_blank" rel="noopener noreferrer" className="mono text-sm px-3 py-1.5 rounded-md border hairline hover:border-brand hover:text-brand transition flex items-center gap-1.5"><Icon name="book" size={14} /> {ui.officialDocs[lang]} <Icon name="external" size={12} /></a>}
        {tool.repo && <a href={tool.repo} target="_blank" rel="noopener noreferrer" className="mono text-sm px-3 py-1.5 rounded-md border hairline hover:border-brand hover:text-brand transition flex items-center gap-1.5">{ui.sourceRepo[lang]} <Icon name="external" size={12} /></a>}
      </div>

      <div className="mt-6 flex gap-1 border-b hairline overflow-x-auto thin-scroll">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`mono px-3.5 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition flex items-center gap-1.5 ${tab === t.id ? "border-brand text-brand" : "border-transparent text-muted hover:text-fg"}`}>
            <Icon name={t.icon} size={14} />{t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[16rem]">
        {tab === "demo" && tool.demo && (
          <div>
            <Terminal demo={tool.demo} />
            <p className="mt-3 mono text-xs text-muted">{lang === "th" ? "// เดโมจำลองผลลัพธ์จริง กด play เพื่อเล่น ปรับความเร็วได้" : "// simulated replay of real output — press play, adjust speed"}</p>
          </div>
        )}
        {tab === "overview" && (
          <div className="space-y-6">
            <p className="text-[15px] leading-7">{tool.description[lang]}</p>
            {tool.notes && (
              <div className="rounded-md border-l-2 border-brand bg-brand/5 p-4">
                <div className="mono text-[10px] uppercase tracking-widest text-brand mb-1.5">{ui.notes[lang]}</div>
                <p className="text-sm leading-6 text-fg/90">{tool.notes[lang]}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">{tool.tags.map((t) => <span key={t} className="mono text-xs px-2 py-0.5 rounded border hairline text-muted">{t}</span>)}</div>
          </div>
        )}
        {tab === "install" && tool.install && <div className="space-y-2">{tool.install.map((c, i) => c.startsWith("#") ? <p key={i} className="mono text-sm text-muted">{c}</p> : <CodeLine key={i} code={c} />)}</div>}
        {tab === "usage" && tool.usage && <div className="space-y-4">{tool.usage.map((u, i) => <div key={i}><CodeLine code={u.cmd} /><p className="mt-1.5 text-sm text-muted pl-1">{u.desc[lang]}</p></div>)}</div>}
        {tab === "cheatsheet" && tool.cheatsheet && <pre className="rounded-md border hairline bg-bg p-4 mono text-[13px] overflow-x-auto thin-scroll leading-relaxed">{tool.cheatsheet.join("\n")}</pre>}
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mono font-semibold mb-4 text-muted text-sm uppercase tracking-wider">{ui.relatedIn[lang]} {cat?.name[lang]}</h2>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">{related.map((t) => <ToolCard key={t.id} tool={t} />)}</div>
        </div>
      )}
    </div>
  );
}
