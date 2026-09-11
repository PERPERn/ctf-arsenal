"use client";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { tools } from "@/lib/tools";
import { useApp } from "./providers";
import { Icon } from "./icons";

const toolName = (id: string) => tools.find((t) => t.id === id)?.name ?? id;

export function GuidesPage() {
  const { lang } = useApp();
  const L = (th: string, en: string) => (lang === "th" ? th : en);
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="border-b hairline pb-6">
        <div className="mono inline-flex items-center gap-2 text-brand text-sm"><Icon name="book" size={18} /> guides</div>
        <h1 className="mt-2 text-3xl font-bold">{L("คู่มือ & Playbook", "Guides & Playbooks")}</h1>
        <p className="mt-2 text-muted">{L("ลำดับการแก้โจทย์ที่เราเขียนขึ้นเอง สองภาษา", "Problem-solving orders written by us, in both languages.")}</p>
      </div>
      <div className="mt-6 space-y-4">
        {guides.map((g, gi) => (
          <div key={g.id} className="rounded-md border hairline bg-card overflow-hidden">
            <div className="p-4 border-b hairline flex items-baseline gap-3">
              <span className="mono text-brand text-sm">{String(gi + 1).padStart(2, "0")}</span>
              <div><h2 className="mono font-semibold">{g.title[lang]}</h2><p className="text-sm text-muted mt-0.5">{g.summary[lang]}</p></div>
            </div>
            <ol className="divide-y hairline">
              {g.steps.map((s, i) => (
                <li key={i} className="p-4 flex gap-3.5">
                  <span className="grid place-items-center h-6 w-6 shrink-0 rounded border border-brand/30 text-brand mono text-xs">{i + 1}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[15px]">{s.title[lang]}</h3>
                    <p className="text-sm text-muted mt-1 leading-6">{s.body[lang]}</p>
                    {s.tools.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{s.tools.map((t) => <Link key={t} href={`/tools/${t}`} className="mono text-xs px-2 py-0.5 rounded border hairline text-brand hover:border-brand transition">{toolName(t)}</Link>)}</div>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
