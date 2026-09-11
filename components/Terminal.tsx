"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import type { Demo } from "@/lib/types";
import { useApp } from "./providers";

interface Line { kind: "cmd" | "out" | "comment"; text: string; }

// Flatten demo steps into a queue of characters to reveal, so commands "type"
// and output "prints".
function buildQueue(demo: Demo, prompt: string) {
  const q: { line: Line; typed: boolean }[] = [];
  for (const s of demo.steps) {
    if (s.comment) q.push({ line: { kind: "comment", text: "# " + s.comment }, typed: false });
    if (s.cmd) q.push({ line: { kind: "cmd", text: s.cmd }, typed: true });
    if (s.out) for (const l of s.out.split("\n")) q.push({ line: { kind: "out", text: l }, typed: false });
  }
  return q;
}

export function Terminal({ demo }: { demo: Demo }) {
  const { lang } = useApp();
  const prompt = demo.prompt ?? "ctf";
  const queue = useRef(buildQueue(demo, prompt));
  const [rendered, setRendered] = useState<Line[]>([]);
  const [current, setCurrent] = useState<{ line: Line; shown: string } | null>(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [speed, setSpeed] = useState(1);
  const scroller = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setRendered([]); setCurrent(null); setIdx(0); setDone(false); setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (idx >= queue.current.length) { setDone(true); setPlaying(false); return; }
    const { line, typed } = queue.current[idx];
    if (!typed) {
      timer.current = setTimeout(() => {
        setRendered((r) => [...r, line]);
        setIdx((i) => i + 1);
      }, (line.kind === "comment" ? 260 : 45) / speed);
      return;
    }
    // type the command char by char
    let i = 0;
    const type = () => {
      i++;
      setCurrent({ line, shown: line.text.slice(0, i) });
      if (i < line.text.length) timer.current = setTimeout(type, (28 + Math.random() * 40) / speed);
      else timer.current = setTimeout(() => { setRendered((r) => [...r, line]); setCurrent(null); setIdx((n) => n + 1); }, 320 / speed);
    };
    type();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, idx, speed]);

  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [rendered, current]);

  const renderLine = (l: Line, key: number, typingShown?: string) => {
    if (l.kind === "cmd")
      return (
        <div key={key} className="flex gap-2 whitespace-pre-wrap break-all">
          <span className="text-brand2 shrink-0 select-none">{prompt}<span className="text-muted">$</span></span>
          <span className="text-fg">{typingShown ?? l.text}{typingShown !== undefined && <span className="inline-block w-2 -mb-0.5 bg-brand2 animate-blink">&nbsp;</span>}</span>
        </div>
      );
    if (l.kind === "comment") return <div key={key} className="text-muted/70 italic whitespace-pre-wrap break-all">{l.text}</div>;
    return <div key={key} className="text-muted whitespace-pre-wrap break-all">{highlight(l.text)}</div>;
  };

  return (
    <div className="rounded-xl overflow-hidden border shadow-card bg-[#0b0e17]">
      <div className="flex items-center gap-2 px-4 h-10 bg-[#121525] border-b border-white/5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-white/50 font-mono truncate">{demo.title[lang]}</span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setSpeed((s) => (s >= 4 ? 1 : s * 2))} className="text-[11px] px-1.5 py-0.5 rounded text-white/60 hover:text-white hover:bg-white/10 font-mono tabular-nums">{speed}×</button>
          {!playing && !done && <button onClick={() => setPlaying(true)} className="text-xs px-2 py-1 rounded bg-brand/80 text-white hover:bg-brand">▶ {lang === "th" ? "เล่น" : "Play"}</button>}
          {playing && <button onClick={() => { setPlaying(false); if (timer.current) clearTimeout(timer.current); }} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">⏸</button>}
          {done && <button onClick={reset} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">↻ {lang === "th" ? "ซ้ำ" : "Replay"}</button>}
        </div>
      </div>
      <div ref={scroller} className="p-4 font-mono text-[13px] leading-relaxed h-72 overflow-auto terminal-scroll">
        {rendered.map((l, i) => renderLine(l, i))}
        {current && renderLine(current.line, -1, current.shown)}
        {!playing && !done && rendered.length === 0 && (
          <button onClick={() => setPlaying(true)} className="text-white/40 hover:text-white/70 transition">
            <span className="text-brand2">{prompt}<span className="text-muted">$</span></span> <span className="animate-blink">▋</span>
            <div className="mt-2 text-xs">▶ {lang === "th" ? "กดเพื่อเล่นเดโม" : "press to play the demo"}</div>
          </button>
        )}
      </div>
    </div>
  );
}

// light output highlighting: flags, status keywords
function highlight(text: string) {
  const parts: React.ReactNode[] = [];
  const re = /(CTT\{[^}]*\}|[A-Z]+\{[^}]*\}|Correct!|Cracked|success|Found[^\n]*|<-- \w+|<-- suspicious|suspicious)/g;
  let last = 0, m: RegExpExecArray | null, k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const cls = /CTT\{|success|Cracked|Correct|Found|\{/.test(m[0]) ? "text-emerald-400 font-semibold" : "text-amber-400";
    parts.push(<span key={k++} className={cls}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
