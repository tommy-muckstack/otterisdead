"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { addAction, ask, editSegment, fmtDuration, fmtTime, keywords, matchRanges, outline, removeAction, renameSpeaker, summarize, toMarkdown, toSrt, toText, toggleAction, toggleHighlight, type Meeting } from "@/lib/otter/model";
import { deleteAudio, loadAudio, saveAudio } from "@/lib/otter/audio";
import { Avatar, colorFor, dl, slug } from "./ui";

type Tab = "summary" | "actions" | "notes" | "ask";
function Marked({ text, q }: { text: string; q: string }) {
  const r = matchRanges(text, q); if (!r.length) return <>{text}</>; const out: React.ReactNode[] = []; let at = 0;
  r.forEach(([a, b], i) => { out.push(text.slice(at, a), <mark key={i}>{text.slice(a, b)}</mark>); at = b; }); out.push(text.slice(at)); return <>{out}</>;
}

export function MeetingView({ m, onChange, onDelete, onBack, focusSeg }: { m: Meeting; onChange: (f: (m: Meeting) => Meeting) => void; onDelete: () => void; onBack: () => void; focusSeg?: string }) {
  const [tab, setTab] = useState<Tab>("summary"); const [q, setQ] = useState(""); const [editing, setEditing] = useState<string | null>(null); const [rename, setRename] = useState<string | null>(null);
  const [newAct, setNewAct] = useState(""); const [question, setQuestion] = useState(""); const [asked, setAsked] = useState(""); const [audio, setAudio] = useState<string | null>(null); const [menu, setMenu] = useState(false); const [flash, setFlash] = useState<string | undefined>(focusSeg);
  const audioEl = useRef<HTMLAudioElement>(null); const fileEl = useRef<HTMLInputElement>(null);
  const sum = useMemo(() => summarize(m.segments), [m.segments]); const kw = useMemo(() => keywords(m.segments), [m.segments]); const out = useMemo(() => outline(m.segments), [m.segments]);
  const answers = useMemo(() => (asked ? ask(m, asked) : []), [m, asked]);
  useEffect(() => { let url: string | null = null; let dead = false; loadAudio(m.id).then(b => { if (b && !dead) { url = URL.createObjectURL(b); setAudio(url); } }); return () => { dead = true; if (url) URL.revokeObjectURL(url); }; }, [m.id]);
  useEffect(() => { if (!flash) return; const el = document.getElementById("seg-" + flash); el?.scrollIntoView({ block: "center" }); const t = setTimeout(() => setFlash(undefined), 2200); return () => clearTimeout(t); }, [flash]);
  const jump = (id: string, start: number) => { setFlash(id); if (audioEl.current && audio) { audioEl.current.currentTime = start; audioEl.current.play().catch(() => {}); } };
  const attach = async (f: File | undefined) => { if (!f) return; if (await saveAudio(m.id, f)) setAudio(URL.createObjectURL(f)); };
  const matches = q.trim() ? m.segments.filter(s => s.text.toLowerCase().includes(q.trim().toLowerCase())).length : 0;
  const done = m.actions.filter(a => a.done).length;
  const idx = (name: string) => Math.max(0, m.speakers.indexOf(name));

  return <div className="ott-mv">
    <header className="ott-mv__hd">
      <button className="ott-btn ott-btn--ghost" onClick={onBack} aria-label="Back to conversations">← Conversations</button>
      <input className="ott-title" aria-label="Title" value={m.title} onChange={e => onChange(x => ({ ...x, title: e.target.value }))} />
      <span className="ott-muted ott-mv__meta">{new Date(m.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · {fmtDuration(m.duration)}</span>
      <div className="ott-menuwrap"><button className="ott-btn" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(v => !v)}>Export ▾</button>
        {menu && <div className="ott-menu" role="menu" onMouseLeave={() => setMenu(false)}>
          <button role="menuitem" onClick={() => { dl(slug(m.title) + ".md", toMarkdown(m), "text/markdown"); setMenu(false); }}>Markdown (.md)</button>
          <button role="menuitem" onClick={() => { dl(slug(m.title) + ".txt", toText(m)); setMenu(false); }}>Transcript (.txt)</button>
          <button role="menuitem" onClick={() => { dl(slug(m.title) + ".srt", toSrt(m)); setMenu(false); }}>Subtitles (.srt)</button>
          <button role="menuitem" onClick={() => { navigator.clipboard?.writeText(toMarkdown(m)); setMenu(false); }}>Copy as Markdown</button></div>}</div>
      <button className="ott-btn ott-btn--danger" onClick={() => { if (confirm("Delete this conversation?")) { deleteAudio(m.id); onDelete(); } }}>Delete</button>
    </header>
    <div className="ott-mv__audio">
      {audio ? <audio ref={audioEl} src={audio} controls aria-label="Recording" /> : <button className="ott-btn ott-btn--ghost" onClick={() => fileEl.current?.click()}>＋ Attach audio to play along</button>}
      <input ref={fileEl} type="file" accept="audio/*" hidden data-testid="audio-file" onChange={e => attach(e.target.files?.[0])} />
    </div>
    <div className="ott-mv__cols">
      <section className="ott-tr" aria-label="Transcript">
        <div className="ott-tr__tools"><input className="ott-search" aria-label="Search in transcript" placeholder="Search transcript" value={q} onChange={e => setQ(e.target.value)} />{q.trim() && <span className="ott-muted" data-testid="matches">{matches} {matches === 1 ? "line" : "lines"}</span>}
          <span className="ott-spkrs">{m.speakers.map((s, i) => rename === s
            ? <input key={s} className="ott-rename" autoFocus aria-label={`Rename ${s}`} defaultValue={s} onBlur={e => { onChange(x => renameSpeaker(x, s, e.target.value)); setRename(null); }} onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") setRename(null); }} />
            : <button key={s} className="ott-chip" title="Rename speaker" onClick={() => setRename(s)}><Avatar name={s} i={i} size={16} />{s}</button>)}</span></div>
        <div className="ott-tr__list">
          {m.segments.map(s => <div key={s.id} id={"seg-" + s.id} data-testid="segment" className={"ott-seg" + (s.hl ? " is-hl" : "") + (flash === s.id ? " is-flash" : "")}>
            <Avatar name={s.speaker} i={idx(s.speaker)} />
            <div className="ott-seg__body"><div className="ott-seg__h"><b style={{ color: colorFor(idx(s.speaker)) }}>{s.speaker}</b><button className="ott-time" onClick={() => jump(s.id, s.start)} aria-label={`Jump to ${fmtTime(s.start)}`}>{fmtTime(s.start)}</button>
              <span className="ott-seg__tools"><button aria-label={s.hl ? "Remove highlight" : "Highlight"} aria-pressed={!!s.hl} onClick={() => onChange(x => toggleHighlight(x, s.id))}>{s.hl ? "★" : "☆"}</button><button aria-label="Edit text" onClick={() => setEditing(s.id)}>✎</button></span></div>
              {editing === s.id ? <textarea className="ott-edit" autoFocus aria-label="Edit transcript text" defaultValue={s.text} rows={3} onBlur={e => { onChange(x => editSegment(x, s.id, e.target.value.trim() || s.text)); setEditing(null); }} onKeyDown={e => { if (e.key === "Escape") setEditing(null); if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); (e.target as HTMLTextAreaElement).blur(); } }} />
                : <p onDoubleClick={() => setEditing(s.id)}><Marked text={s.text} q={q} /></p>}</div></div>)}
          {!m.segments.length && <p className="ott-empty">No transcript. This conversation only has notes.</p>}
        </div>
      </section>
      <aside className="ott-side" aria-label="Insights">
        <div role="tablist" className="ott-tabs">{(["summary", "actions", "notes", "ask"] as Tab[]).map(t => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t === "actions" ? `Action items${m.actions.length ? ` ${done}/${m.actions.length}` : ""}` : t[0].toUpperCase() + t.slice(1)}</button>)}</div>
        <div className="ott-panel" role="tabpanel">
          {tab === "summary" && <>
            <h3>Overview</h3>{sum.length ? <ul>{sum.map((s, i) => <li key={i}>{s}</li>)}</ul> : <p className="ott-muted">Not enough conversation to summarize yet.</p>}
            {kw.length > 0 && <><h3>Keywords</h3><div className="ott-chips">{kw.map(k => <button key={k} className="ott-chip" onClick={() => setQ(k)}>{k}</button>)}</div></>}
            {out.length > 0 && <><h3>Outline</h3><ol className="ott-outline">{out.map(o => <li key={o.start}><button onClick={() => { const s = m.segments.find(x => x.start >= o.start); if (s) jump(s.id, s.start); }}><span>{fmtTime(o.start)}</span>{o.title}</button></li>)}</ol></>}
            {m.segments.some(s => s.hl) && <><h3>Highlights</h3><ul className="ott-hls">{m.segments.filter(s => s.hl).map(s => <li key={s.id}><button onClick={() => jump(s.id, s.start)}>“{s.text}”<small> {s.speaker} · {fmtTime(s.start)}</small></button></li>)}</ul></>}
          </>}
          {tab === "actions" && <>
            <ul className="ott-acts" data-testid="actions">{m.actions.map(a => <li key={a.id} className={a.done ? "done" : ""}><label><input type="checkbox" checked={a.done} onChange={() => onChange(x => toggleAction(x, a.id))} /><span>{a.text}</span></label>
              <div className="ott-acts__meta"><span className="ott-chip">{a.owner}</span>{a.due && <span className="ott-chip ott-chip--due">{a.due}</span>}{a.seg && <button className="ott-link" onClick={() => { const s = m.segments.find(x => x.id === a.seg); if (s) jump(s.id, s.start); }}>in transcript</button>}<button className="ott-link" aria-label="Remove action item" onClick={() => onChange(x => removeAction(x, a.id))}>remove</button></div></li>)}
              {!m.actions.length && <li className="ott-muted">No action items found. Add one below.</li>}</ul>
            <form className="ott-row" onSubmit={e => { e.preventDefault(); onChange(x => addAction(x, newAct)); setNewAct(""); }}><input aria-label="New action item" placeholder="Add an action item" value={newAct} onChange={e => setNewAct(e.target.value)} /><button className="ott-btn">Add</button></form></>}
          {tab === "notes" && <textarea className="ott-notes" aria-label="Notes" rows={14} placeholder="Your notes, saved automatically." value={m.notes} onChange={e => onChange(x => ({ ...x, notes: e.target.value }))} />}
          {tab === "ask" && <>
            <form className="ott-row" onSubmit={e => { e.preventDefault(); setAsked(question); }}><input aria-label="Ask about this conversation" placeholder="Ask: who owns the load test?" value={question} onChange={e => setQuestion(e.target.value)} /><button className="ott-btn ott-btn--primary">Ask</button></form>
            {asked && <div data-testid="answers">{answers.length ? <><p className="ott-muted">Most relevant moments (matched locally on your keywords):</p><ul className="ott-hls">{answers.map(s => <li key={s.id}><button onClick={() => jump(s.id, s.start)}>“{s.text}”<small> {s.speaker} · {fmtTime(s.start)}</small></button></li>)}</ul></> : <p className="ott-muted">Nothing in this conversation matches that question.</p>}</div>}</>}
        </div>
      </aside>
    </div>
  </div>;
}
