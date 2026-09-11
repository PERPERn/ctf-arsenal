"use client";
import { useState } from "react";

export function CodeLine({ code }: { code: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="group flex items-center gap-2 rounded-lg border bg-[#0b0e17] px-3 py-2 font-mono text-[13px] text-white/90">
      <span className="text-brand2 select-none">$</span>
      <code className="flex-1 break-all">{code}</code>
      <button onClick={() => { navigator.clipboard?.writeText(code); setOk(true); setTimeout(() => setOk(false), 1200); }}
        className="opacity-0 group-hover:opacity-100 transition text-xs px-2 py-0.5 rounded border border-white/15 text-white/60 hover:text-white shrink-0">
        {ok ? "✓" : "⧉"}
      </button>
    </div>
  );
}
