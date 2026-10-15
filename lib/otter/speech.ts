"use client";
/** Thin wrapper over the browser SpeechRecognition API (Chrome, Edge, Safari). Nothing is sent to our servers; the browser vendor handles recognition. */
type Rec = { continuous: boolean; interimResults: boolean; lang: string; start(): void; stop(): void; abort(): void; onresult: ((e: any) => void) | null; onend: (() => void) | null; onerror: ((e: any) => void) | null };
export const speechSupported = () => typeof window !== "undefined" && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
export type SpeechHandlers = { onInterim: (t: string) => void; onFinal: (t: string) => void; onError: (code: string) => void };
/** Starts continuous recognition and restarts it when the browser ends a session after silence. Returns a stop function. */
export function startSpeech(h: SpeechHandlers, lang?: string): () => void {
  const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; let stopped = false; let rec: Rec | null = null;
  const run = () => {
    rec = new Ctor() as Rec; rec.continuous = true; rec.interimResults = true; rec.lang = lang || navigator.language || "en-US";
    rec.onresult = e => { let interim = ""; for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) h.onFinal(r[0].transcript); else interim += r[0].transcript; } h.onInterim(interim); };
    rec.onerror = e => { const c = String(e?.error ?? "error"); if (c === "no-speech" || c === "aborted") return; if (c === "not-allowed" || c === "service-not-allowed" || c === "audio-capture") stopped = true; h.onError(c); };
    rec.onend = () => { if (!stopped) { try { run(); } catch { h.onError("restart-failed"); } } };
    rec.start();
  };
  run();
  return () => { stopped = true; try { rec?.stop(); } catch { /* ignore */ } };
}
