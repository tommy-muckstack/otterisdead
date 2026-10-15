/** Pure meeting-notes logic: parsing, extractive summary, action items, search and exports. No DOM, no network. */
export type Segment = { id: string; speaker: string; start: number; text: string; hl?: boolean };
export type Action = { id: string; text: string; owner: string; due?: string; done: boolean; seg?: string };
export type Meeting = { id: string; title: string; createdAt: number; duration: number; segments: Segment[]; speakers: string[]; notes: string; actions: Action[]; source: "live" | "import" | "demo" };

let n = 0;
export const uid = (p = "id") => `${p}_${Date.now().toString(36)}${(n++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const fmtTime = (s: number) => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60; return (h ? `${h}:${String(m).padStart(2, "0")}` : String(m)) + `:${String(r).padStart(2, "0")}`; };
export const fmtDuration = (s: number) => { s = Math.round(s); if (s < 60) return `${s}s`; const m = Math.round(s / 60); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`; };
const words = (t: string) => (t.match(/[\p{L}\p{N}'’]+/gu) ?? []);
const estDur = (t: string) => Math.max(2, words(t).length / 2.6);

/* ---------- parsing ---------- */
const TS = /^\[?(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:[.,]\d+)?\]?\s*[-–]?\s*/;
const toSec = (h: string | undefined, m: string, s: string) => (h ? +h * 3600 : 0) + +m * 60 + +s;
const SPK = /^(\p{Lu}[\p{L}0-9.'’-]*(?: \p{Lu}[\p{L}0-9.'’-]*| \d+){0,3}):\s+(.*)$/u;

/** Accepts "Name: text", "[00:01:23] Name: text", plain paragraphs, SRT and WebVTT. Untimed lines get estimated times. */
export function parseTranscript(raw: string): { segments: Segment[]; speakers: string[] } {
  const text = raw.replace(/\r/g, "").replace(/^\uFEFF/, "").trim();
  const out: Segment[] = []; let last = "Speaker 1"; let t = 0;
  const push = (speaker: string | null, body: string, start: number | null) => {
    body = body.trim(); if (!body) return;
    const sp = speaker ?? last; last = sp; const s = start ?? t; t = s + estDur(body);
    const prev = out[out.length - 1];
    if (prev && prev.speaker === sp && start === null && speaker === null) { prev.text += " " + body; t = prev.start + estDur(prev.text); return; }
    out.push({ id: uid("s"), speaker: sp, start: s, text: body });
  };
  if (/-->/.test(text)) {
    for (const block of text.replace(/^WEBVTT.*\n/, "").split(/\n{2,}/)) {
      const lines = block.split("\n").filter(Boolean); const i = lines.findIndex(l => l.includes("-->")); if (i < 0) continue;
      const m = lines[i].match(/(?:(\d{1,2}):)?(\d{1,2}):(\d{2})/); const start = m ? toSec(m[1], m[2], m[3]) : null;
      const body = lines.slice(i + 1).join(" ").replace(/<[^>]+>/g, ""); const sm = body.match(SPK); push(sm ? sm[1] : null, sm ? sm[2] : body, start);
    }
  } else {
    for (let line of text.split("\n")) {
      line = line.trim(); if (!line) continue;
      let start: number | null = null; const tm = line.match(TS); if (tm && line.slice(tm[0].length).length) { start = toSec(tm[1], tm[2], tm[3]); line = line.slice(tm[0].length); }
      const sm = line.match(SPK); push(sm ? sm[1].trim() : null, sm ? sm[2] : line, start);
    }
  }
  const speakers = [...new Set(out.map(s => s.speaker))];
  return { segments: out, speakers };
}

/* ---------- text analysis ---------- */
const STOP = new Set(("a about above after again all also am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers him his how i if in into is it its just let like me more most my no nor not now of off on once only or other our out over own same she should so some such than that the their them then there these they this those through to too under until up us very was we were what when where which while who why will with would you your yeah okay ok um uh right going get got really think know want need one two thing things kind sort yes sure well maybe actually basically i'll i'm i've we'll we're we've it's that's there's don't can't won't let's what's you'll you're they're didn't doesn't isn't i’ll i’m we’ll it’s that’s don’t let’s").split(" "));
export function keywords(segs: Segment[], k = 8): string[] {
  const f = new Map<string, number>();
  for (const s of segs) for (const w0 of words(s.text)) { const w = w0.toLowerCase().replace(/['’]s$/, ""); if (w.length < 4 || STOP.has(w) || /^\d+$/.test(w)) continue; f.set(w, (f.get(w) ?? 0) + 1); }
  return [...f.entries()].filter(([, c]) => c > 1 || f.size < k).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, k).map(([w]) => w);
}
const sentences = (t: string) => t.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 0);

/** Extractive overview: the highest-scoring sentences (by keyword frequency), kept in spoken order. */
export function summarize(segs: Segment[], max = 4): string[] {
  const kw = new Set(keywords(segs, 14)); const all: { i: number; s: string; score: number }[] = []; let i = 0;
  for (const g of segs) for (const s of sentences(g.text)) { const ws = words(s); if (ws.length < 6) { i++; continue; } const hit = ws.filter(w => kw.has(w.toLowerCase().replace(/['’]s$/, ""))).length; all.push({ i: i++, s, score: hit / Math.sqrt(ws.length) + (ws.length > 28 ? -0.5 : 0) }); }
  return all.sort((a, b) => b.score - a.score).slice(0, max).sort((a, b) => a.i - b.i).map(x => x.s);
}
/** Time-chunked outline: each chunk labelled with its top keywords. */
export function outline(segs: Segment[], chunks = 4): { start: number; title: string }[] {
  if (!segs.length) return []; const total = segs[segs.length - 1].start + 1; const size = Math.max(1, Math.ceil(segs.length / Math.min(chunks, segs.length)));
  const res: { start: number; title: string }[] = []; void total;
  for (let i = 0; i < segs.length; i += size) { const part = segs.slice(i, i + size); const kw = keywords(part, 3); res.push({ start: part[0].start, title: kw.length ? kw.map(w => w[0].toUpperCase() + w.slice(1)).join(", ") : "Discussion" }); }
  return res;
}

const DAYS = "monday|tuesday|wednesday|thursday|friday|saturday|sunday";
const ACTION = new RegExp(`\\b(i(?:'|’)?ll|i will|we(?:'|’)?ll|we will|i need to|we need to|need to|needs to|i(?:'|’)?m going to|let(?:'|’)?s|action item|follow up|follow-up|to-?do|can you|could you|please|should|by (?:${DAYS}|tomorrow|eod|end of (?:day|week)|next week))\\b`, "i");
const DUE = new RegExp(`\\b(?:by|before|on|until)\\s+((?:next\\s+)?(?:${DAYS})|tomorrow|eod|end of (?:day|week)|next week)\\b|\\b(tomorrow|next week|this week)\\b`, "i");
const NAMED = /^(?:(?:and|so|ok|okay|yeah)\s+)?([A-Z][a-z]{1,15})\s+(?:will|to|needs to|should|can|is going to)\b/;
/** Finds commitments ("I'll send…", "Priya to draft…", "can you…") and owners / due words. */
export function detectActions(segs: Segment[]): Action[] {
  const res: Action[] = [];
  for (const g of segs) for (const s of sentences(g.text)) {
    if (words(s).length < 4 || !(ACTION.test(s) || NAMED.test(s))) continue;
    if (/\?$/.test(s) && !/\b(can|could) you\b|\bplease\b/i.test(s)) continue;
    if (/^(yeah|yes|ok|okay|sure)[,.!]?$/i.test(s)) continue;
    const named = s.match(NAMED); let owner = g.speaker;
    if (named && !/^(We|They|That|This|There|It|You|He|She|The|And|But|So)$/.test(named[1])) owner = named[1];
    else if (/\b(can|could) you\b|\bplease\b/i.test(s) && !/\bi(?:'|’)?ll\b/i.test(s)) owner = "Unassigned";
    const d = s.match(DUE); const due = d ? (d[1] ?? d[2]).replace(/^./, c => c.toUpperCase()) : undefined;
    res.push({ id: uid("a"), text: s.replace(/^(?:and|so|ok|okay|yeah)[, ]+/i, "").replace(/^./, c => c.toUpperCase()), owner, due, done: false, seg: g.id });
  }
  return res.slice(0, 20);
}

/* ---------- search ---------- */
export type Hit = { meeting: string; seg?: string; where: "title" | "transcript" | "notes"; snippet: string; start?: number };
export function search(meetings: Meeting[], q: string, limit = 40): Hit[] {
  const needle = q.trim().toLowerCase(); if (!needle) return []; const hits: Hit[] = [];
  const snip = (t: string, at: number) => { const a = Math.max(0, at - 36), b = Math.min(t.length, at + needle.length + 60); return (a > 0 ? "…" : "") + t.slice(a, b) + (b < t.length ? "…" : ""); };
  for (const m of meetings) {
    const ti = m.title.toLowerCase().indexOf(needle); if (ti >= 0) hits.push({ meeting: m.id, where: "title", snippet: m.title });
    for (const s of m.segments) { const i = s.text.toLowerCase().indexOf(needle); if (i >= 0) hits.push({ meeting: m.id, seg: s.id, where: "transcript", snippet: snip(s.text, i), start: s.start }); }
    const ni = m.notes.toLowerCase().indexOf(needle); if (ni >= 0) hits.push({ meeting: m.id, where: "notes", snippet: snip(m.notes, ni) });
  }
  return hits.slice(0, limit);
}
/** "Ask" over one meeting: returns the most relevant transcript lines for a question (extractive, local). */
export function ask(m: Meeting, q: string, k = 3): Segment[] {
  const qs = new Set(words(q).map(w => w.toLowerCase()).filter(w => w.length > 2 && !STOP.has(w))); if (!qs.size) return [];
  return m.segments.map(s => ({ s, score: words(s.text).filter(w => qs.has(w.toLowerCase())).length })).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.s.start - b.s.start).slice(0, k).map(x => x.s);
}

/* ---------- edits ---------- */
export const renameSpeaker = (m: Meeting, from: string, to: string): Meeting => {
  to = to.trim(); if (!to || to === from) return m; const speakers = [...new Set(m.speakers.map(s => (s === from ? to : s)))];
  return { ...m, speakers, segments: m.segments.map(s => (s.speaker === from ? { ...s, speaker: to } : s)), actions: m.actions.map(a => (a.owner === from ? { ...a, owner: to } : a)) };
};
export const editSegment = (m: Meeting, id: string, text: string): Meeting => ({ ...m, segments: m.segments.map(s => (s.id === id ? { ...s, text } : s)) });
export const toggleHighlight = (m: Meeting, id: string): Meeting => ({ ...m, segments: m.segments.map(s => (s.id === id ? { ...s, hl: !s.hl } : s)) });
export const toggleAction = (m: Meeting, id: string): Meeting => ({ ...m, actions: m.actions.map(a => (a.id === id ? { ...a, done: !a.done } : a)) });
export const addAction = (m: Meeting, text: string, owner = "Unassigned"): Meeting => (text.trim() ? { ...m, actions: [...m.actions, { id: uid("a"), text: text.trim(), owner, done: false }] } : m);
export const removeAction = (m: Meeting, id: string): Meeting => ({ ...m, actions: m.actions.filter(a => a.id !== id) });

export function buildMeeting(title: string, segments: Segment[], source: Meeting["source"], notes = "", createdAt = Date.now()): Meeting {
  const speakers = [...new Set(segments.map(s => s.speaker))]; const last = segments[segments.length - 1];
  return { id: uid("m"), title: title.trim() || "Untitled meeting", createdAt, duration: last ? Math.ceil(last.start + estDur(last.text)) : 0, segments, speakers, notes, actions: detectActions(segments), source };
}
export const importMeeting = (title: string, raw: string): Meeting | null => { const p = parseTranscript(raw); return p.segments.length ? buildMeeting(title, p.segments, "import") : null; };

/* ---------- live capture ---------- */
export type Live = { segments: Segment[]; interim: string; speaker: string };
export const liveStart = (speaker = "Speaker 1"): Live => ({ segments: [], interim: "", speaker });
/** A final recognition result: merge into the current segment when same speaker and spoken within 6s. */
export function liveFinal(l: Live, text: string, at: number): Live {
  text = text.trim(); if (!text) return { ...l, interim: "" }; const cap = text.replace(/^./, c => c.toUpperCase()); const prev = l.segments[l.segments.length - 1];
  if (prev && prev.speaker === l.speaker && at - (prev.start + estDur(prev.text)) < 6) return { ...l, interim: "", segments: [...l.segments.slice(0, -1), { ...prev, text: prev.text + " " + cap }] };
  return { ...l, interim: "", segments: [...l.segments, { id: uid("s"), speaker: l.speaker, start: at, text: cap }] };
}
export const liveInterim = (l: Live, text: string): Live => ({ ...l, interim: text });
export const liveSwitch = (l: Live, speaker: string): Live => ({ ...l, speaker });

/* ---------- export ---------- */
const srtTime = (s: number) => { const ms = Math.round((s % 1) * 1000); const t = Math.floor(s); return `${String(Math.floor(t / 3600)).padStart(2, "0")}:${String(Math.floor((t % 3600) / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")},${String(ms).padStart(3, "0")}`; };
export const toText = (m: Meeting) => m.segments.map(s => `[${fmtTime(s.start)}] ${s.speaker}: ${s.text}`).join("\n");
export const toSrt = (m: Meeting) => m.segments.map((s, i) => { const end = Math.min(s.start + estDur(s.text), m.segments[i + 1]?.start ?? Infinity); return `${i + 1}\n${srtTime(s.start)} --> ${srtTime(end)}\n${s.speaker}: ${s.text}\n`; }).join("\n");
export function toMarkdown(m: Meeting): string {
  const sum = summarize(m.segments); const L = [`# ${m.title}`, "", `${new Date(m.createdAt).toISOString().slice(0, 10)} · ${fmtDuration(m.duration)} · ${m.speakers.join(", ")}`, ""];
  if (sum.length) L.push("## Summary", ...sum.map(s => `- ${s}`), "");
  if (m.actions.length) L.push("## Action items", ...m.actions.map(a => `- [${a.done ? "x" : " "}] ${a.text} (${a.owner}${a.due ? `, ${a.due}` : ""})`), "");
  if (m.notes.trim()) L.push("## Notes", m.notes.trim(), "");
  const hl = m.segments.filter(s => s.hl); if (hl.length) L.push("## Highlights", ...hl.map(s => `- **${s.speaker}** (${fmtTime(s.start)}): ${s.text}`), "");
  L.push("## Transcript", ...m.segments.map(s => `**${s.speaker}** (${fmtTime(s.start)}): ${s.text}`));
  return L.join("\n") + "\n";
}
export const matchRanges = (text: string, q: string): [number, number][] => { const n = q.trim().toLowerCase(); if (!n) return []; const r: [number, number][] = []; const l = text.toLowerCase(); let i = 0; while ((i = l.indexOf(n, i)) >= 0) { r.push([i, i + n.length]); i += n.length; } return r; };
