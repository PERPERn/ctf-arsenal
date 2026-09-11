"use client";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { tools } from "@/lib/tools";
import { useApp } from "./providers";

const toolName = (id: string) => tools.find((t) => t.id === id)?.name ?? id;

export function GuidesPage() {
  const { lang } = useApp();
  const L = (th: string, en: string) => (lang === "th" ? th : en);
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-black gradient-text">{L("คู่มือ & Playbook", "Guides & Playbooks")}</h1>
      <p className="mt-3 text-muted">{L("แนวคิดและลำดับการแก้โจทย์ที่เราเขียนขึ้นเอง สองภาษา", "Workflows and problem-solving orders, written by us, in both languages.")}</p>
      <div className="mt-8 space-y-6">
        {guides.map((g) => (
          <div key={g.id} className="rounded-2xl border bg-card overflow-hidden">
            <div className="p-5 border-b flex items-start gap-3">
              <span className="text-3xl">{g.icon}</span>
              <div>
                <h2 className="text-xl font-bold">{g.title[lang]}</h2>
                <p className="text-sm text-muted mt-1">{g.summary[lang]}</p>
              </div>
            </div>
            <ol className="divide-y">
              {g.steps.map((s, i) => (
                <li key={i} className="p-5 flex gap-4">
                  <span className="grid place-items-center h-8 w-8 shrink-0 rounded-full bg-brand/15 text-brand font-bold text-sm">{i + 1}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{s.title[lang]}</h3>
                    <p className="text-sm text-muted mt-1 leading-6">{s.body[lang]}</p>
                    {s.tools.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.tools.map((t) => (
                          <Link key={t} href={`/tools/${t}`} className="text-xs px-2 py-0.5 rounded-md bg-surface border text-brand hover:border-brand transition">{toolName(t)}</Link>
                        ))}
                      </div>
                    )}
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
