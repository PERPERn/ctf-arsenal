"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useApp } from "./providers";
import { analyzeText, analyzeFile, type TextReport, type FileReport } from "@/lib/identify";
import { Icon } from "./icons";

function Copy({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1200); }}
      className="shrink-0 grid place-items-center h-6 w-6 rounded border hairline text-muted hover:text-brand hover:border-brand transition">
      <Icon name={ok ? "check" : "copy"} size={13} />
    </button>
  );
}

const confCls: Record<string, string> = {
  high: "text-ok border-ok/40 bg-ok/10",
  med: "text-brand border-brand/40 bg-brand/10",
  low: "text-muted border-border bg-surface",
};

export function Identify({ compact = false }: { compact?: boolean }) {
  const { lang } = useApp();
  const [text, setText] = useState("");
  const [tr, setTr] = useState<TextReport | null>(null);
  const [fr, setFr] = useState<FileReport | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const L = (th: string, en: string) => (lang === "th" ? th : en);

  const runText = useCallback((v: string) => {
    setFr(null); setImgUrl(null);
    setTr(v.trim() ? analyzeText(v) : null);
  }, []);
  const runFile = useCallback(async (file: File) => {
    setTr(null);
    setImgUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    setFr(analyzeFile(file.name, await file.arrayBuffer()));
    setText("");
  }, []);
  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) runFile(f); }, [runFile]);
  useEffect(() => { try { const q = new URLSearchParams(window.location.search).get("q"); if (q) { setText(q); setTr(analyzeText(q)); } } catch {} }, []);

  const rep = tr ?? fr?.text ?? null;

  return (
    <div className="w-full">
      <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
        className={`rounded-md border transition ${drag ? "border-brand bg-brand/5" : "hairline"} bg-bg`}>
        <textarea value={text} onChange={(e) => { setText(e.target.value); runText(e.target.value); }}
          placeholder={L("วางข้อความ แฮช base64… หรือลากไฟล์/รูปมาวาง", "paste text, a hash, base64… or drop a file / image")}
          rows={compact ? 3 : 5} spellCheck={false}
          className="w-full bg-transparent resize-none px-3.5 py-3 mono text-sm outline-none placeholder:text-muted/70" />
        <div className="flex items-center gap-2 px-3 pb-2.5 flex-wrap">
          <button onClick={() => fileInput.current?.click()}
            className="mono text-xs px-2.5 py-1.5 rounded border border-brand/40 text-brand hover:bg-brand/10 transition flex items-center gap-1.5">
            <Icon name="upload" size={13} /> {L("อัปโหลดไฟล์/รูป", "upload file/image")}
          </button>
          <input ref={fileInput} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) runFile(f); }} />
          {(tr || fr) && <button onClick={() => { setText(""); setTr(null); setFr(null); setImgUrl(null); }}
            className="mono text-xs px-2.5 py-1.5 rounded border hairline text-muted hover:text-fg transition flex items-center gap-1"><Icon name="x" size={12} /> {L("ล้าง", "clear")}</button>}
        </div>
      </div>

      {imgUrl && <div className="mt-3 flex justify-center"><img src={imgUrl} alt="preview" className="max-h-52 rounded-md border hairline" /></div>}

      {(tr || fr) && (
        <div className="mt-4 space-y-3 animate-fade-up">
          {/* answer */}
          {rep?.answer && (
            <div className="rounded-md border border-ok/40 bg-ok/10 p-3.5 flex items-center gap-3">
              <Icon name="flag" size={20} className="text-ok shrink-0" />
              <div className="min-w-0">
                <div className="mono text-[10px] uppercase tracking-widest solved">{L("คำตอบ", "answer")}</div>
                <div className="mono font-bold text-base break-all">{rep.answer}</div>
              </div>
              <div className="ml-auto"><Copy text={rep.answer} /></div>
            </div>
          )}

          {/* plaintext note */}
          {rep?.plaintext && !rep.answer && (
            <div className="rounded-md border hairline bg-card p-3.5 text-sm text-muted flex items-center gap-2">
              <Icon name="check" size={16} className="text-ok" /> {L("ดูเป็นข้อความอ่านออกอยู่แล้ว ไม่ต้องถอด", "Already looks like readable text — nothing to decode.")}
            </div>
          )}

          {/* JWT */}
          {tr?.jwt && (
            <div className="rounded-md border hairline bg-card p-3.5">
              <div className="mono text-[10px] uppercase tracking-widest text-muted mb-2 flex items-center gap-1.5"><Icon name="key" size={13} /> JWT</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {(["header", "payload"] as const).map((k) => (
                  <div key={k}>
                    <div className="mono text-[11px] text-muted mb-1">{k}</div>
                    <pre className="mono text-xs bg-bg border hairline rounded p-2.5 overflow-x-auto thin-scroll">{JSON.stringify(tr.jwt![k], null, 2)}</pre>
                  </div>
                ))}
              </div>
              {tr.jwt.warnings.map((w, i) => (
                <div key={i} className="mt-2 mono text-xs text-brand flex items-start gap-1.5"><Icon name="shield" size={13} className="shrink-0 mt-px" />{w}</div>
              ))}
            </div>
          )}

          {/* file summary */}
          {fr && (
            <div className="rounded-md border hairline bg-card p-3.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <Stat label={L("ไฟล์", "file")} value={fr.name} />
                <Stat label={L("ขนาด", "size")} value={`${fr.size.toLocaleString()} B`} />
                <Stat label="magic" value={fr.magic ?? L("ไม่ทราบ", "unknown")} accent={!!fr.magic} />
                <Stat label="entropy" value={`${fr.entropy.toFixed(2)} b/B`} accent={fr.entropy > 7.3} />
              </div>
              <div className="mt-2.5 mono text-[11px] text-muted break-all">{fr.hex}</div>
              {fr.flags.length > 0 && <div className="mt-3 space-y-1">
                <div className="mono text-[10px] uppercase tracking-widest solved">{L("พบ flag ในไบต์", "flags in bytes")}</div>
                {fr.flags.map((f) => <div key={f} className="flex items-center gap-2 mono text-sm font-bold text-ok"><Icon name="flag" size={13} />{f}<Copy text={f} /></div>)}
              </div>}
              {fr.strings.length > 0 && <details className="mt-3">
                <summary className="mono text-[11px] cursor-pointer text-muted hover:text-fg">{L("สตริงน่าสนใจ", "interesting strings")} ({fr.strings.length})</summary>
                <div className="mt-2 max-h-40 overflow-auto mono text-xs space-y-0.5 thin-scroll">{fr.strings.map((s, i) => <div key={i} className="text-muted break-all">{s}</div>)}</div>
              </details>}
            </div>
          )}

          {/* identified */}
          {rep && rep.ids.length > 0 && (
            <div className="rounded-md border hairline bg-card p-3.5">
              <div className="mono text-[10px] uppercase tracking-widest text-muted mb-2.5">{L("ระบุได้ว่า", "identified as")}</div>
              <div className="flex flex-wrap gap-2">
                {rep.ids.map((it, i) => (
                  <span key={i} className={`mono text-xs px-2 py-1 rounded border ${confCls[it.conf]}`}>
                    <b>{it.label}</b>{it.detail && <span className="opacity-70"> · {it.detail}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* how to solve */}
          {rep && rep.suggestions.length > 0 && (
            <div className="rounded-md border hairline bg-card p-3.5">
              <div className="mono text-[10px] uppercase tracking-widest text-muted mb-2.5">{L("วิธีแก้ต่อ", "how to solve")}</div>
              <ul className="space-y-1.5">
                {rep.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Icon name="chevronRight" size={14} className="text-brand mt-0.5 shrink-0" />
                    <span className="mono text-[13px]">{s.text[lang]}{s.tool && <span className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded border border-brand/30 text-brand">{s.tool}</span>}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* decode attempts */}
          {rep && rep.decodes.length > 0 && (
            <div className="rounded-md border hairline bg-card p-3.5">
              <div className="mono text-[10px] uppercase tracking-widest text-muted mb-2.5">{L("ผลการถอด", "decode chain")}</div>
              <div className="space-y-2">
                {rep.decodes.slice(0, rep.answer ? 3 : 6).map((d, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-12 shrink-0 h-1 rounded-full bg-surface overflow-hidden mt-2"><div className="h-full bg-brand" style={{ width: `${Math.round(d.score * 100)}%` }} /></div>
                    <div className="min-w-0 flex-1">
                      <div className="mono text-[11px] text-muted">{d.chain.join(" › ")}{d.isFlag && <span className="ml-1 solved">← flag</span>}</div>
                      <div className="mono text-sm break-all">{d.text.length > 160 ? d.text.slice(0, 160) + "…" : d.text}</div>
                    </div>
                    <Copy text={d.text} />
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
    <div className="min-w-0">
      <div className="mono text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`mono text-sm truncate ${accent ? "text-brand" : ""}`} title={value}>{value}</div>
    </div>
  );
}
