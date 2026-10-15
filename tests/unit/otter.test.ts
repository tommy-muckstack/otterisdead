import { describe, it, expect } from "vitest";
import { addAction, ask, buildMeeting, detectActions, editSegment, fmtDuration, fmtTime, importMeeting, keywords, liveFinal, liveInterim, liveStart, liveSwitch, matchRanges, outline, parseTranscript, removeAction, renameSpeaker, search, summarize, toMarkdown, toSrt, toText, toggleAction, toggleHighlight } from "@/lib/otter/model";
import { seedMeetings } from "@/lib/otter/seed";

describe("formatting", () => {
  it("formats times", () => { expect(fmtTime(0)).toBe("0:00"); expect(fmtTime(75)).toBe("1:15"); expect(fmtTime(3725)).toBe("1:02:05"); });
  it("formats durations", () => { expect(fmtDuration(42)).toBe("42s"); expect(fmtDuration(300)).toBe("5 min"); expect(fmtDuration(4000)).toBe("1 h 7 min"); });
});

describe("parseTranscript", () => {
  it("reads timestamps and speakers", () => {
    const p = parseTranscript("[0:05] Ann: Hello there.\n[1:10:02] Bob Smith: Second line.");
    expect(p.segments.map(s => [s.speaker, s.start, s.text])).toEqual([["Ann", 5, "Hello there."], ["Bob Smith", 4202, "Second line."]]);
    expect(p.speakers).toEqual(["Ann", "Bob Smith"]);
  });
  it("estimates times for untimed lines and keeps order", () => {
    const p = parseTranscript("Ann: One two three four five six seven eight nine ten.\nBob: Short reply.");
    expect(p.segments[0].start).toBe(0); expect(p.segments[1].start).toBeGreaterThan(2);
  });
  it("merges untimed continuation lines into the previous speaker", () => {
    const p = parseTranscript("Ann: First part\nsecond part\n\nthird part");
    expect(p.segments).toHaveLength(1); expect(p.segments[0].text).toBe("First part second part third part");
  });
  it("parses SRT", () => {
    const srt = "1\n00:00:01,000 --> 00:00:03,500\nAnn: Hi all\n\n2\n00:00:04,000 --> 00:00:06,000\nBob: Hey";
    const p = parseTranscript(srt); expect(p.segments.map(s => [s.speaker, s.start, s.text])).toEqual([["Ann", 1, "Hi all"], ["Bob", 4, "Hey"]]);
  });
  it("parses WebVTT with voice tags stripped", () => {
    const vtt = "WEBVTT\n\n00:00:02.000 --> 00:00:04.000\n<v Ann>Welcome</v>\n\n00:01:02.000 --> 00:01:04.000\nBack again";
    const p = parseTranscript(vtt); expect(p.segments[0].text).toBe("Welcome"); expect(p.segments[1].start).toBe(62);
  });
  it("does not treat sentences with colons mid-line as speakers", () => {
    const p = parseTranscript("We agreed on the plan: ship it on Friday."); expect(p.speakers).toEqual(["Speaker 1"]);
  });
  it("returns nothing for empty input", () => { expect(parseTranscript("  \n ").segments).toEqual([]); expect(importMeeting("x", "")).toBeNull(); });
});

describe("analysis", () => {
  const [sync] = seedMeetings(0);
  it("finds keywords without stopwords", () => { const k = keywords(sync.segments); expect(k).toContain("launch"); expect(k).not.toContain("that"); expect(k.length).toBeLessThanOrEqual(8); });
  it("summarizes extractively in spoken order", () => {
    const s = summarize(sync.segments); expect(s.length).toBeGreaterThan(1); expect(s.length).toBeLessThanOrEqual(4);
    const text = sync.segments.map(x => x.text).join(" "); for (const line of s) expect(text).toContain(line);
    const idx = s.map(l => text.indexOf(l)); expect([...idx].sort((a, b) => a - b)).toEqual(idx);
  });
  it("builds an outline", () => { const o = outline(sync.segments, 3); expect(o).toHaveLength(3); expect(o[0].start).toBe(0); expect(o[0].title.length).toBeGreaterThan(0); expect(outline([])).toEqual([]); });
  it("detects action items with owners and due words", () => {
    const a = detectActions(sync.segments);
    const t = a.find(x => /time zone test cases/.test(x.text))!; expect(t.owner).toBe("Priya"); expect(t.due).toBe("Thursday");
    const e = a.find(x => /onboarding emails and send/.test(x.text))!; expect(e.owner).toBe("Priya"); expect(e.due).toBe("Friday");
    const v = a.find(x => /walkthrough video/.test(x.text))!; expect(v.owner).toBe("Sam"); expect(v.due).toBe("Tomorrow");
    const l = a.find(x => /load test/.test(x.text) && /Jonas will/.test(x.text))!; expect(l.owner).toBe("Jonas");
    expect(a.find(x => /^Can you also add a section/.test(x.text))!.owner).toBe("Unassigned");
  });
  it("ignores plain questions and filler", () => {
    const m = buildMeeting("t", parseTranscript("Ann: What do you think about the roadmap?\nBob: Yeah.\nBob: Looks fine to me overall.").segments, "import"); expect(m.actions).toEqual([]);
  });
  it("answers questions with the most relevant lines", () => {
    const hits = ask(sync, "who is running the load test?"); expect(hits[0].text).toMatch(/load test/i); expect(ask(sync, "the of and")).toEqual([]);
  });
});

describe("search", () => {
  const ms = seedMeetings(0);
  it("finds transcript, title and notes hits", () => {
    const h = search(ms, "calendar"); expect(h.some(x => x.where === "transcript")).toBe(true); expect(h.every(x => x.snippet.toLowerCase().includes("calendar"))).toBe(true);
    expect(search(ms, "interview").some(x => x.where === "title")).toBe(true); expect(search(ms, "emails per booking").some(x => x.where === "notes")).toBe(true);
    expect(search(ms, "   ")).toEqual([]); expect(search(ms, "zzzzqq")).toEqual([]);
  });
  it("finds match ranges case-insensitively", () => { expect(matchRanges("Load the load test", "LOAD")).toEqual([[0, 4], [9, 13]]); expect(matchRanges("abc", "")).toEqual([]); });
});

describe("edits", () => {
  const base = () => seedMeetings(0)[0];
  it("renames a speaker across segments and action owners", () => {
    const m = renameSpeaker(base(), "Priya", "Priya Shah"); expect(m.speakers).toContain("Priya Shah"); expect(m.speakers).not.toContain("Priya");
    expect(m.segments.every(s => s.speaker !== "Priya")).toBe(true); expect(m.actions.some(a => a.owner === "Priya Shah")).toBe(true);
  });
  it("merges speakers when renamed onto an existing name", () => { const m = renameSpeaker(base(), "Sam", "Jonas"); expect(m.speakers.filter(s => s === "Jonas")).toHaveLength(1); });
  it("ignores blank or identical renames", () => { const m = base(); expect(renameSpeaker(m, "Sam", "  ")).toBe(m); expect(renameSpeaker(m, "Sam", "Sam")).toBe(m); });
  it("edits text, toggles highlight and actions", () => {
    let m = base(); const id = m.segments[0].id; m = editSegment(m, id, "New"); expect(m.segments[0].text).toBe("New");
    m = toggleHighlight(m, id); expect(m.segments[0].hl).toBe(true); m = toggleHighlight(m, id); expect(m.segments[0].hl).toBe(false);
    const a = m.actions[0].id; m = toggleAction(m, a); expect(m.actions[0].done).toBe(true);
    m = addAction(m, "  Book the offsite ", "Chris"); expect(m.actions.at(-1)).toMatchObject({ text: "Book the offsite", owner: "Chris" }); expect(addAction(m, "  ")).toBe(m);
    m = removeAction(m, a); expect(m.actions.find(x => x.id === a)).toBeUndefined();
  });
});

describe("live capture", () => {
  it("merges nearby finals from the same speaker and splits on speaker change or silence", () => {
    let l = liveStart("Ann"); l = liveInterim(l, "hel"); expect(l.interim).toBe("hel");
    l = liveFinal(l, "hello everyone", 1); l = liveFinal(l, "welcome back", 3); expect(l.segments).toHaveLength(1); expect(l.segments[0].text).toBe("Hello everyone Welcome back"); expect(l.interim).toBe("");
    l = liveSwitch(l, "Bob"); l = liveFinal(l, "thanks", 5); expect(l.segments).toHaveLength(2); expect(l.segments[1]).toMatchObject({ speaker: "Bob", start: 5 });
    l = liveFinal(l, "after a long pause", 60); expect(l.segments).toHaveLength(3);
    expect(liveFinal(l, "   ", 70).segments).toHaveLength(3);
  });
  it("builds a meeting from live segments", () => {
    let l = liveStart("Ann"); l = liveFinal(l, "I'll send the notes tomorrow", 0); const m = buildMeeting(" ", l.segments, "live"); expect(m.title).toBe("Untitled meeting"); expect(m.actions[0]).toMatchObject({ owner: "Ann", due: "Tomorrow" }); expect(m.duration).toBeGreaterThan(0);
  });
});

describe("export", () => {
  const m = seedMeetings(Date.UTC(2026, 9, 14))[1];
  it("writes markdown with sections", () => { const md = toMarkdown(m); expect(md).toMatch(/^# Customer interview/); expect(md).toContain("## Summary"); expect(md).toContain("## Action items"); expect(md).toContain("## Transcript"); expect(md).toContain("## Highlights"); expect(md).toContain("**Dana** ("); });
  it("writes text and srt that parse back", () => {
    const t = parseTranscript(toText(m)); expect(t.segments).toHaveLength(m.segments.length); expect(t.segments[2].speaker).toBe(m.segments[2].speaker);
    const s = parseTranscript(toSrt(m)); expect(s.segments).toHaveLength(m.segments.length); expect(s.segments[3].start).toBe(Math.floor(m.segments[3].start));
    expect(toSrt(m)).toMatch(/^1\n00:00:00,000 --> 00:00:\d\d,\d{3}\n/);
  });
});
