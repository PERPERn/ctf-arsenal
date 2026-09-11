"use client";
import { useState, useRef, useCallback } from "react";
import { useApp } from "./providers";
import { analyzeText, analyzeFile, type TextReport, type FileReport } from "@/lib/identify";

const confColor: Record<string, string> = { high: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10", med: "text-amber-400 border-amber-400/40 bg-amber-400/10", low: "text-muted border-border bg-surface" };

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1200); }}
      className="shrink-0 text-xs px-2 py-1 rounded-md border hover:border-brand hover:text-brand transition">
      {ok ? "✓" : "⧉"}
    </button>
  );
}

export function Identify({ compact = false }: { compact?: boolean }) {
  const { lang } = useApp();
  const [text, setText] = useState("");
  const [textReport, setTextReport] = useState<TextReport | null>(null);
  const [fileReport, setFileReport] = useState<FileReport | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const runText = useCallback((v: string) => {
    setFileReport(null); setImgUrl(null);
    if (!v.trim()) { setTextReport(null); return; }
    setTextReport(analyzeText(v));
  }, []);

  const runFile = useCallback(async (file: File) => {
    setBusy(true); setTextReport(null);
    if (file.type.startsWith("image/")) { setImgUrl(URL.createObjectURL(file)); } else setImgUrl(null);
    const buf = await file.arrayBuffer();
    setFileReport(analyzeFile(file.name, buf));
    setText("");
    setBusy(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) runFile(f);
  }, [runFile]);

  const L = (th: string, en: string) => (lang === "th" ? th : en);

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`relative rounded-2xl border-2 border-dashed transition ${drag ? "border-brand bg-brand/5" : "border-border"} glass`}
      >
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); runText(e.target.value); }}
          placeholder={L("วางข้อความ แฮช base64 หรือลากไฟล์/รูปมาวางที่นี่…", "Paste text, a hash, base64… or drop a file / image here…")}
          rows={compact ? 3 : 4}
          spellCheck={false}
          className="w-full bg-transparent resize-none px-4 py-3 font-mono text-sm outline-none placeholder:text-muted"
        />
        <div className="flex items-center gap-2 px-3 pb-3 flex-wrap">
          <button onClick={() => fileInput.current?.click()}
            className="text-sm px-3 py-1.5 rounded-lg bg-brand/15 text-brand font-medium hover:bg-brand/25 transition">
            📎 {L("อัปโหลดไฟล์ / รูป", "Upload file / image")}
          </button>
          <input ref={fileInput} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) runFile(f); }} />
          {(textReport || fileReport) && (
            <button onClick={() => { setText(""); setTextReport(null); setFileReport(null); setImgUrl(null); }}
              className="text-sm px-3 py-1.5 rounded-lg border hover:border-brand transition">
              {L("ล้าง", "Clear")}
            </button>
          )}
          <span className="text-xs text-muted ml-auto">{L("ทำงานในเบราว์เซอร์ล้วน ไฟล์ไม่ถูกอัปโหลดไปไหน", "Runs entirely in your browser — nothing is uploaded")}</span>
        </div>
        {busy && <div className="absolute inset-0 grid place-items-center bg-bg/50 rounded-2xl text-sm">…</div>}
      </div>

      {imgUrl && (
        <div className="mt-4 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgUrl} alt="preview" className="max-h-56 rounded-xl border" />
        </div>
      )}

      {/* results */}
      {(textReport || fileReport) && (
        <div className="mt-5 grid gap-4 animate-fade-up">
          {/* answer banner */}
          {textReport?.answer && (
            <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4 flex items-center gap-3">
              <span className="text-2xl">🚩</span>
              <div className="min-w-0">
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">{L("คำตอบ", "Answer")}</div>
                <div className="font-mono font-bold text-lg break-all">{textReport.answer}</div>
              </div>
              <div className="ml-auto"><CopyBtn text={textReport.answer} /></div>
            </div>
          )}

          {fileReport && (
            <div className="rounded-xl border p-4 bg-card">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <Stat label={L("ชื่อไฟล์", "File")} value={fileReport.name} />
                <Stat label={L("ขนาด", "Size")} value={`${fileReport.size.toLocaleString()} B`} />
                <Stat label="Magic" value={fileReport.magic ?? L("ไม่ทราบ", "unknown")} accent={!!fileReport.magic} />
                <Stat label="Entropy" value={`${fileReport.entropy.toFixed(2)} b/B`} accent={fileReport.entropy > 7.3} />
              </div>
              <div className="mt-3 font-mono text-xs text-muted break-all">{fileReport.hex}</div>
              {fileReport.flags.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-emerald-400 mb-1">{L("พบ flag ในไบต์", "Flag candidates in bytes")}</div>
                  {fileReport.flags.map((f) => (
                    <div key={f} className="flex items-center gap-2 font-mono text-sm font-bold text-emerald-400"><span>🚩</span>{f}<CopyBtn text={f} /></div>
                  ))}
                </div>
              )}
              {fileReport.strings.length > 0 && (
                <details className="mt-3">
                  <summary className="text-xs font-semibold cursor-pointer text-muted hover:text-fg">{L("สตริงน่าสนใจ", "Interesting strings")} ({fileReport.strings.length})</summary>
                  <div className="mt-2 max-h-40 overflow-auto font-mono text-xs space-y-0.5 terminal-scroll">
                    {fileReport.strings.map((s, i) => <div key={i} className="text-muted break-all">{s}</div>)}
                  </div>
                </details>
              )}
            </div>
          )}

          {/* identified */}
          {(() => { const ids = textReport?.ids ?? []; return ids.length > 0 && (
            <div className="rounded-xl border p-4 bg-card">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">{L("ระบุได้ว่า", "Identified as")}</div>
              <div className="flex flex-wrap gap-2">
                {ids.map((it, i) => (
                  <span key={i} className={`text-sm px-2.5 py-1 rounded-lg border ${confColor[it.conf]}`}>
                    <b>{it.label}</b>{it.detail && <span className="opacity-70"> · {it.detail}</span>}
                  </span>
                ))}
              </div>
            </div>
          ); })()}

          {/* how to solve */}
          {(() => { const sug = (textReport?.suggestions ?? fileReport?.suggestions ?? []); return sug.length > 0 && (
            <div className="rounded-xl border p-4 bg-card">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">{L("วิธีแก้ต่อ", "How to solve")}</div>
              <ul className="space-y-2">
                {sug.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-brand mt-0.5">▸</span>
                    <span className="font-mono">{s.text[lang]}{s.tool && <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-brand/15 text-brand">{s.tool}</span>}</span>
                  </li>
                ))}
              </ul>
            </div>
          ); })()}

          {/* decode attempts */}
          {textReport && textReport.decodes.length > 0 && (
            <div className="rounded-xl border p-4 bg-card">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">{L("ผลการถอด", "Decode attempts")}</div>
              <div className="space-y-2">
                {textReport.decodes.slice(0, textReport.answer ? 3 : 6).map((d, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="w-16 shrink-0 h-1.5 rounded-full bg-surface overflow-hidden mt-2">
                      <div className="h-full bg-gradient-to-r from-brand to-brand2" style={{ width: `${Math.round(d.score * 100)}%` }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted font-mono">{d.chain.join(" › ")}{d.isFlag && <span className="ml-1 text-emerald-400">← flag</span>}</div>
                      <div className="font-mono text-sm break-all">{d.text.length > 160 ? d.text.slice(0, 160) + "…" : d.text}</div>
                    </div>
                    <CopyBtn text={d.text} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted">{label}</div>
      <div className={`font-mono text-sm font-medium truncate ${accent ? "text-brand" : ""}`} title={value}>{value}</div>
    </div>
  );
}
