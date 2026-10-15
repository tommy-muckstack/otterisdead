"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { buildMeeting, fmtTime, liveFinal, liveInterim, liveStart, liveSwitch, type Live, type Meeting } from "@/lib/otter/model";
import { DEMO_LINES } from "@/lib/otter/seed";
import { speechSupported, startSpeech } from "@/lib/otter/speech";
import { colorFor, Avatar } from "./ui";

type Status = "idle" | "rec" | "paused";

export function Recorder({ onSave, onCancel }: { onSave: (m: Meeting, audio?: Blob) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(""); const [status, setStatus] = useState<Status>("idle"); const [live, setLive] = useState<Live>(() => liveStart("Speaker 1"));
  const [speakers, setSpeakers] = useState(["Speaker 1", "Speaker 2"]); const [notes, setNotes] = useState(""); const [typed, setTyped] = useState(""); const [msg, setMsg] = useState(""); const [elapsed, setElapsed] = useState(0);
  const [demo, setDemo] = useState(false); const [supported, setSupported] = useState(true);
  const startedAt = useRef(0); const accum = useRef(0); const timer = useRef<number | null>(null); const stopSpeech = useRef<null | (() => void)>(null);
  const mr = useRef<MediaRecorder | null>(null); const chunks = useRef<Blob[]>([]); const stream = useRef<MediaStream | null>(null); const demoTimers = useRef<number[]>([]); const endRef = useRef<HTMLDivElement>(null);
  const nowRef = useRef<() => number>(() => 0); nowRef.current = () => (startedAt.current ? accum.current + (performance.now() - startedAt.current) / 1000 : accum.current);
  useEffect(() => { setSupported(speechSupported()); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [live.segments.length, live.interim]);
  useEffect(() => () => { stopAll(); }, []); // eslint-disable-line

  const tick = () => { if (timer.current) clearInterval(timer.current); timer.current = window.setInterval(() => setElapsed(nowRef.current()), 250); };
  const stopAll = () => { stopSpeech.current?.(); stopSpeech.current = null; demoTimers.current.forEach(clearTimeout); demoTimers.current = []; if (timer.current) clearInterval(timer.current); try { if (mr.current && mr.current.state !== "inactive") mr.current.stop(); } catch { /* ignore */ } stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; };

  const begin = useCallback(async (isDemo: boolean) => {
    setMsg(""); setDemo(isDemo); startedAt.current = performance.now(); setStatus("rec"); tick();
    if (isDemo) { // stream scripted lines; each "spoken" 2.2s apart on the demo clock
      const sp = [...new Set(DEMO_LINES.map(l => l.speaker))]; setSpeakers(sp); setLive(liveStart(sp[0]));
      DEMO_LINES.forEach((l, i) => demoTimers.current.push(window.setTimeout(() => { const at = i * 15 + 1; setLive(p => liveInterim(liveSwitch(p, l.speaker), l.text.split(" ").slice(0, 3).join(" "))); demoTimers.current.push(window.setTimeout(() => setLive(p => liveFinal(liveSwitch(p, l.speaker), l.text, at)), 220)); }, 500 + i * 650)));
      demoTimers.current.push(window.setTimeout(() => { accum.current = DEMO_LINES.length * 15; startedAt.current = 0; setElapsed(DEMO_LINES.length * 15); setStatus("paused"); if (timer.current) clearInterval(timer.current); }, 500 + DEMO_LINES.length * 650 + 400));
      return;
    }
    if (speechSupported()) stopSpeech.current = startSpeech({ onInterim: t => setLive(p => liveInterim(p, t)), onFinal: t => setLive(p => liveFinal(p, t, nowRef.current())), onError: c => setMsg(c === "not-allowed" || c === "service-not-allowed" ? "Microphone permission was denied. Allow it in the address bar, or type lines below." : `Speech recognition stopped (${c}). You can keep typing lines below.`) });
    try { if (!stream.current && navigator.mediaDevices?.getUserMedia) { stream.current = await navigator.mediaDevices.getUserMedia({ audio: true }); const r = new MediaRecorder(stream.current); r.ondataavailable = e => e.data.size && chunks.current.push(e.data); r.start(1000); mr.current = r; } else if (mr.current?.state === "paused") mr.current.resume(); } catch { /* audio is optional */ }
  }, []);
  const pause = () => { accum.current = nowRef.current(); startedAt.current = 0; setStatus("paused"); stopSpeech.current?.(); stopSpeech.current = null; try { mr.current?.state === "recording" && mr.current.pause(); } catch { /* ignore */ } if (timer.current) clearInterval(timer.current); setLive(p => liveInterim(p, "")); };
  const resume = () => { if (demo) return; begin(false); };
  const addTyped = () => { const t = typed.trim(); if (!t) return; if (status === "idle") { startedAt.current = 0; } setLive(p => liveFinal(p, t, nowRef.current())); setTyped(""); };
  const addSpeaker = () => { const n = `Speaker ${speakers.length + 1}`; setSpeakers(s => [...s, n]); setLive(p => liveSwitch(p, n)); };
  const pickSpeaker = (s: string) => setLive(p => liveSwitch(p, s));
  const finish = async () => {
    const dur = nowRef.current(); stopAll(); setStatus("idle");
    if (!live.segments.length && !notes.trim()) { setMsg("Nothing captured yet. Speak, type a line, or run the demo first."); return; }
    const m = buildMeeting(title || `Meeting ${new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}`, live.segments, demo ? "demo" : "live", notes); m.duration = Math.max(m.duration, Math.ceil(dur));
    let blob: Blob | undefined; if (chunks.current.length) { blob = new Blob(chunks.current, { type: chunks.current[0].type || "audio/webm" }); }
    onSave(m, blob);
  };
  useEffect(() => { const h = (e: KeyboardEvent) => { if (/^[1-9]$/.test(e.key) && !(e.target as HTMLElement).closest("input,textarea") && speakers[+e.key - 1]) pickSpeaker(speakers[+e.key - 1]); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [speakers]);

  return <div className="ott-rec" data-testid="recorder">
    <div className="ott-rec__top">
      <input className="ott-title" aria-label="Meeting title" placeholder="Untitled meeting" value={title} onChange={e => setTitle(e.target.value)} />
      <button className="ott-btn ott-btn--ghost" onClick={() => { stopAll(); onCancel(); }}>Cancel</button>
    </div>
    <div className="ott-rec__bar">
      <div className={"ott-clock" + (status === "rec" ? " is-live" : "")} data-testid="clock" aria-live="off"><span className="ott-dot" />{fmtTime(elapsed)}</div>
      {status === "idle" && <><button className="ott-btn ott-btn--rec" data-testid="start" onClick={() => begin(false)}>● Start recording</button><button className="ott-btn" data-testid="demo" onClick={() => begin(true)}>▶ Run a demo recording</button></>}
      {status === "rec" && <button className="ott-btn" data-testid="pause" onClick={pause}>❚❚ Pause</button>}
      {status === "paused" && !demo && <button className="ott-btn ott-btn--rec" data-testid="resume" onClick={resume}>● Resume</button>}
      {(status !== "idle" || live.segments.length > 0) && <button className="ott-btn ott-btn--primary" data-testid="stop" onClick={finish}>■ Stop &amp; save</button>}
    </div>
    {!supported && status === "idle" && <p className="ott-note" role="note">This browser has no speech recognition (use Chrome, Edge or Safari for live transcription). You can still run the demo, type lines below, or import a transcript.</p>}
    {msg && <p className="ott-note ott-note--warn" role="status">{msg}</p>}
    <div className="ott-rec__speakers" role="group" aria-label="Current speaker"><span className="ott-muted">Speaking:</span>
      {speakers.map((s, i) => <button key={s} className={"ott-spk" + (live.speaker === s ? " on" : "")} aria-pressed={live.speaker === s} onClick={() => pickSpeaker(s)}><Avatar name={s} i={i} size={18} />{s}<kbd>{i + 1}</kbd></button>)}
      <button className="ott-spk ott-spk--add" onClick={addSpeaker} aria-label="Add speaker">+ Speaker</button></div>
    <div className="ott-rec__cols">
      <div className="ott-live" data-testid="live" aria-live="polite">
        {!live.segments.length && !live.interim && <p className="ott-empty">{status === "idle" ? "Your transcript appears here as you speak. Press a number key to switch speakers." : "Listening…"}</p>}
        {live.segments.map(s => { const i = Math.max(0, speakers.indexOf(s.speaker)); return <div key={s.id} className="ott-seg"><Avatar name={s.speaker} i={i} /><div><div className="ott-seg__h"><b style={{ color: colorFor(i) }}>{s.speaker}</b><span>{fmtTime(s.start)}</span></div><p>{s.text}</p></div></div>; })}
        {live.interim && <div className="ott-seg ott-seg--interim"><Avatar name={live.speaker} i={Math.max(0, speakers.indexOf(live.speaker))} /><div><div className="ott-seg__h"><b>{live.speaker}</b></div><p>{live.interim}…</p></div></div>}
        <div ref={endRef} />
      </div>
      <div className="ott-rec__side">
        <label className="ott-lbl">Type a line as {live.speaker}<span className="ott-row"><input aria-label="Type a line" value={typed} onChange={e => setTyped(e.target.value)} onKeyDown={e => e.key === "Enter" && addTyped()} placeholder="Add to the transcript…" /><button className="ott-btn" onClick={addTyped}>Add</button></span></label>
        <label className="ott-lbl">Your notes<textarea aria-label="Meeting notes" rows={9} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Jot down anything you want to remember…" /></label>
      </div>
    </div>
  </div>;
}
