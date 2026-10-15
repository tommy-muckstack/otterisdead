"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocal } from "@/lib/useLocal";
import { fmtDuration, importMeeting, search, summarize, type Meeting } from "@/lib/otter/model";
import { seedMeetings } from "@/lib/otter/seed";
import { saveAudio, deleteAudio } from "@/lib/otter/audio";
import { Recorder } from "./Recorder";
import { MeetingView } from "./MeetingView";
import { Avatar } from "./ui";

type View = { k: "home" } | { k: "rec" } | { k: "m"; id: string; seg?: string };
const SAMPLE = "Host: Welcome everyone, let's review the launch checklist.\nMia: I'll finish the landing page copy by Friday.\nHost: Great. Omar, can you test the signup flow tomorrow?\nOmar: Yes, I'll test signup on mobile and desktop.";

export function Workspace({ uid, demo }: { uid: string; name: string; email: string; demo: boolean }) {
  const [meetings, setMeetings, ready] = useLocal<Meeting[] | null>(uid, "meetings", null);
  const [view, setView] = useState<View>({ k: "home" }); const [q, setQ] = useState(""); const [imp, setImp] = useState(false);
  useEffect(() => { if (ready && meetings === null) setMeetings(demo ? seedMeetings() : []); }, [ready, meetings, demo, setMeetings]);
  const list = useMemo(() => [...(meetings ?? [])].sort((a, b) => b.createdAt - a.createdAt), [meetings]);
  const hits = useMemo(() => search(list, q), [list, q]);
  const byId = (id: string) => list.find(m => m.id === id);
  const update = (id: string, f: (m: Meeting) => Meeting) => setMeetings(ms => (ms ?? []).map(m => (m.id === id ? f(m) : m)));
  const add = (m: Meeting) => { setMeetings(ms => [m, ...(ms ?? [])]); setView({ k: "m", id: m.id }); setQ(""); };
  if (!ready || meetings === null) return <div className="ott-loading" role="status">Loading your conversations…</div>;
  const cur = view.k === "m" ? byId(view.id) : undefined;

  return <div className="ott">
    <nav className="ott-nav" aria-label="Main">
      <button className="ott-btn ott-btn--rec ott-nav__rec" data-testid="new-recording" onClick={() => setView({ k: "rec" })}>● New recording</button>
      <button className={"ott-nav__i" + (view.k === "home" ? " on" : "")} onClick={() => setView({ k: "home" })}>▤ Conversations <span>{list.length}</span></button>
      <button className="ott-nav__i" onClick={() => setImp(true)} data-testid="open-import">⇪ Import transcript</button>
      <div className="ott-nav__h">Recent</div>
      {list.slice(0, 6).map(m => <button key={m.id} className={"ott-nav__i ott-nav__r" + (cur?.id === m.id ? " on" : "")} onClick={() => setView({ k: "m", id: m.id })}>{m.title}</button>)}
      <p className="ott-nav__foot">Your recordings and transcripts stay in this browser.</p>
    </nav>
    <main className="ott-main">
      {view.k === "rec" && <Recorder onCancel={() => setView({ k: "home" })} onSave={(m, blob) => { if (blob) saveAudio(m.id, blob); add(m); }} />}
      {view.k === "m" && cur && <MeetingView key={cur.id} m={cur} focusSeg={view.seg} onChange={f => update(cur.id, f)} onBack={() => setView({ k: "home" })} onDelete={() => { setMeetings(ms => (ms ?? []).filter(x => x.id !== cur.id)); setView({ k: "home" }); }} />}
      {(view.k === "home" || (view.k === "m" && !cur)) && <Home list={list} q={q} setQ={setQ} hits={hits} open={(id, seg) => setView({ k: "m", id, seg })} onRecord={() => setView({ k: "rec" })} onImport={() => setImp(true)} onDelete={id => { deleteAudio(id); setMeetings(ms => (ms ?? []).filter(x => x.id !== id)); }} />}
    </main>
    {imp && <ImportDialog onClose={() => setImp(false)} onImport={m => { add(m); setImp(false); }} />}
  </div>;
}

function Home({ list, q, setQ, hits, open, onRecord, onImport, onDelete }: { list: Meeting[]; q: string; setQ: (s: string) => void; hits: ReturnType<typeof search>; open: (id: string, seg?: string) => void; onRecord: () => void; onImport: () => void; onDelete: (id: string) => void }) {
  const day = (t: number) => { const d = Math.floor((Date.now() - t) / 86_400_000); return d <= 0 ? "Today" : d === 1 ? "Yesterday" : new Date(t).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }); };
  const groups: [string, Meeting[]][] = []; for (const m of list) { const g = day(m.createdAt); const last = groups[groups.length - 1]; if (last && last[0] === g) last[1].push(m); else groups.push([g, [m]]); }
  const title = (id: string) => list.find(m => m.id === id)?.title ?? "";
  return <div className="ott-home">
    <div className="ott-home__top"><h1>Conversations</h1><input className="ott-search ott-search--big" aria-label="Search all conversations" placeholder="Search every transcript, title and note" value={q} onChange={e => setQ(e.target.value)} /></div>
    {q.trim() ? <section aria-label="Search results" data-testid="results"><p className="ott-muted">{hits.length} {hits.length === 1 ? "result" : "results"} for “{q}”</p>
      <ul className="ott-hits">{hits.map((h, i) => <li key={i}><button onClick={() => open(h.meeting, h.seg)}><b>{title(h.meeting)}</b><span className="ott-chip">{h.where}</span><p>{h.snippet}</p></button></li>)}</ul></section>
      : !list.length ? <div className="ott-hero"><h2>Capture your first conversation</h2><p>Record a meeting with live transcription, or paste in a transcript from anywhere. You get a searchable transcript, a summary and action items.</p><div className="ott-row"><button className="ott-btn ott-btn--rec" onClick={onRecord}>● Start recording</button><button className="ott-btn" onClick={onImport}>Import a transcript</button></div></div>
      : groups.map(([g, ms]) => <section key={g} className="ott-day"><h2>{g}</h2>
        <ul className="ott-cards">{ms.map(m => <li key={m.id} data-testid="meeting-card"><button className="ott-card" onClick={() => open(m.id)}>
          <span className="ott-card__t">{m.title}</span><span className="ott-card__meta">{fmtDuration(m.duration)} · {m.segments.length} lines{m.actions.length ? ` · ${m.actions.filter(a => !a.done).length} open actions` : ""}</span>
          <span className="ott-card__s">{summarize(m.segments, 1)[0] ?? m.notes.slice(0, 120) ?? ""}</span>
          <span className="ott-card__av">{m.speakers.slice(0, 5).map((s, i) => <Avatar key={s} name={s} i={i} size={22} />)}</span></button>
          <button className="ott-card__x" aria-label={`Delete ${m.title}`} onClick={() => { if (confirm(`Delete “${m.title}”?`)) onDelete(m.id); }}>✕</button></li>)}</ul></section>)}
  </div>;
}

function ImportDialog({ onClose, onImport }: { onClose: () => void; onImport: (m: Meeting) => void }) {
  const [title, setTitle] = useState(""); const [text, setText] = useState(""); const [err, setErr] = useState(""); const file = useRef<HTMLInputElement>(null);
  const readFile = async (f?: File) => { if (!f) return; setText(await f.text()); if (!title) setTitle(f.name.replace(/\.[^.]+$/, "")); };
  const go = () => { const m = importMeeting(title || "Imported transcript", text); if (!m) { setErr("Paste or choose a transcript first."); return; } onImport(m); };
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [onClose]);
  return <div className="ott-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="ott-modal" role="dialog" aria-label="Import transcript">
    <h2>Import a transcript</h2><p className="ott-muted">Paste text like <code>Name: what they said</code>, with optional <code>[0:42]</code> timestamps, or choose a .txt, .vtt or .srt file.</p>
    <input className="ott-in" aria-label="Import title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
    <textarea className="ott-in" aria-label="Transcript text" rows={9} placeholder={SAMPLE} value={text} onChange={e => { setText(e.target.value); setErr(""); }} />
    {err && <p className="ott-note ott-note--warn" role="alert">{err}</p>}
    <div className="ott-row ott-row--end"><button className="ott-btn ott-btn--ghost" onClick={() => setText(SAMPLE)}>Use a sample</button><input ref={file} hidden type="file" accept=".txt,.vtt,.srt,.md,text/plain" data-testid="import-file" onChange={e => readFile(e.target.files?.[0])} /><button className="ott-btn" onClick={() => file.current?.click()}>Choose file</button><button className="ott-btn" onClick={onClose}>Cancel</button><button className="ott-btn ott-btn--primary" data-testid="import-go" onClick={go}>Import</button></div>
  </div></div>;
}
