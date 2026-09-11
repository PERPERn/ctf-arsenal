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

const diff = ["", "★ ", "★★ ", "★★★ "];

export function ToolDetail({ tool, related }: { tool: Tool; related: Tool[] }) {
  const { lang } = useApp();
  const cat = categoryMap[tool.category];
  const tabs = [
    tool.demo && { id: "demo", label: ui.demo[lang], icon: "▶" },
    { id: "overview", label: ui.overview[lang], icon: "📖" },
    tool.install && { id: "install", label: ui.install[lang], icon: "⬇" },
    tool.usage && { id: "usage", label: ui.usage[lang], icon: "⌨" },
    tool.cheatsheet && { id: "cheatsheet", label: ui.cheatsheet[lang], icon: "📋" },
  ].filter(Boolean) as { id: string; label: string; icon: string }[];
  const [tab, setTab] = useState(tabs[0].id);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <Link href="/#tools" className="inline-flex items-center gap-1 text-sm text-muted hover:text-brand transition">← {ui.back[lang]}</Link>

      <header className="mt-4 flex items-start gap-4">
        <span className="grid place-items-center h-16 w-16 rounded-2xl text-3xl shrink-0 border"
          style={{ background: `${cat?.color}1a`, borderColor: `${cat?.color}40` }}>{cat?.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-black">{tool.name}</h1>
            {tool.installed && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 font-semibold">✓ {ui.installed[lang]}</span>}
            {tool.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-brand/15 text-brand font-semibold">⭐ {ui.featured[lang]}</span>}
          </div>
          <p className="mt-1 text-muted">{tool.tagline[lang]}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted flex-wrap">
            <Link href={`/#tools`} className="hover:text-brand">{cat?.name[lang]}</Link>
            <span className="text-amber-400">{diff[tool.difficulty]}{ui.difficulty[lang]}</span>
            {tool.platforms && <span>{tool.platforms.join(" · ")}</span>}
          </div>
        </div>
      </header>

      <div className="mt-4 flex gap-2 flex-wrap">
        {tool.official && <a href={tool.official} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-1.5 rounded-lg border hover:border-brand hover:text-brand transition">📄 {ui.officialDocs[lang]} ↗</a>}
        {tool.repo && <a href={tool.repo} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-1.5 rounded-lg border hover:border-brand hover:text-brand transition">⌥ {ui.sourceRepo[lang]} ↗</a>}
      </div>

      {/* tabs */}
      <div className="mt-6 flex gap-1 border-b overflow-x-auto terminal-scroll">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition ${tab === t.id ? "border-brand text-brand" : "border-transparent text-muted hover:text-fg"}`}>
            <span className="mr-1">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[16rem]">
        {tab === "demo" && tool.demo && (
          <div>
            <Terminal demo={tool.demo} />
            <p className="mt-3 text-xs text-muted">{lang === "th" ? "เดโมจำลองผลลัพธ์จริงของคำสั่ง กด ▶ เพื่อเล่น ปรับความเร็วได้" : "A simulated replay of the real command output. Press ▶ to play; adjust the speed."}</p>
          </div>
        )}
        {tab === "overview" && (
          <div className="space-y-6">
            <p className="text-[15px] leading-7">{tool.description[lang]}</p>
            {tool.notes && (
              <div className="rounded-xl border-l-4 border-brand bg-brand/5 p-4">
                <div className="text-xs font-semibold text-brand uppercase tracking-wide mb-1">💡 {ui.notes[lang]}</div>
                <p className="text-sm leading-6 text-fg/90">{tool.notes[lang]}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((t) => <span key={t} className="text-xs px-2 py-1 rounded-md bg-surface border text-muted">#{t}</span>)}
            </div>
          </div>
        )}
        {tab === "install" && tool.install && (
          <div className="space-y-2">{tool.install.map((c, i) => c.startsWith("#") ? <p key={i} className="text-sm text-muted font-mono">{c}</p> : <CodeLine key={i} code={c} />)}</div>
        )}
        {tab === "usage" && tool.usage && (
          <div className="space-y-4">
            {tool.usage.map((u, i) => (
              <div key={i}>
                <CodeLine code={u.cmd} />
                <p className="mt-1.5 text-sm text-muted pl-1">↳ {u.desc[lang]}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "cheatsheet" && tool.cheatsheet && (
          <pre className="rounded-xl border bg-[#0b0e17] p-4 font-mono text-[13px] text-white/85 overflow-x-auto terminal-scroll leading-relaxed">{tool.cheatsheet.join("\n")}</pre>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-bold mb-4">{ui.relatedIn[lang]} {cat?.name[lang]}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((t) => <ToolCard key={t.id} tool={t} />)}</div>
        </div>
      )}
    </div>
  );
}
