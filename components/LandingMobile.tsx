import Link from "next/link";
import "@/app/landing-m.css";

// Phone-width home (<=760px), laid out like otter.ai's "Conversational Knowledge Engine" mobile variant.
// Desktop uses <Landing/>; these sections are hidden above 760px. Artwork is our own CSS.
const Win = () => <div className="ot-win" aria-hidden><div className="ot-win__bar"><i /><i /><i /></div><div className="ot-win__side">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div><div className="ot-win__main"><b /><s /><u /><u /><u /><u /><u /><u /></div></div>;
const Phone = ({ className = "" }: { className?: string }) => <div className={"otm-phone " + className} aria-hidden><i /><b /><s /><u /></div>;
const Logos = ["Free", "Open source", "Apache-2.0"];
const chips = ["Markdown", "Text", "SRT", "VTT import", "TXT import", "Audio seek", "Highlights"];

export function LandingMobileTop() {
  return <section className="otm">
    <div className="otm-hero">
      <h1>Your meeting notetaker, free and open source</h1>
      <p>OtterIsDead transcribes meetings live in your browser and turns them into searchable notes.</p>
      <div className="otm-row"><Link href="/login" className="otm-btn otm-btn--blue">Start for free</Link><Link href="/pricing" className="otm-btn otm-btn--line">See pricing</Link></div>
      <div className="otm-vid" aria-hidden><Win /></div>
      <i className="otm-av" aria-hidden />
      <p className="otm-q">“Every feature is free. No plans, no seats, no trial that runs out.”</p>
      <p className="otm-by">— The OtterIsDead promise</p>
      <span className="otm-dash" aria-hidden><i /><i /><b /></span>
    </div>
    <div className="otm-logos">{Logos.map(l => <span key={l}>{l}</span>)}</div>
    <h2>Live notes while you talk</h2>
    <p className="otm-lede">Record from your browser. OtterIsDead captures the conversation, labels speakers and pulls out action items.</p>
    <Link href="/login" className="otm-btn otm-btn--line otm-demo">Demo it live</Link>
    <article className="otm-c otm-c1"><h3>Ask your transcript</h3><p>A local Ask returns the most relevant lines from your meeting.</p><Phone className="otm-phone--chat" /></article>
    <article className="otm-c otm-c2"><div className="otm-dock" aria-hidden><em /><em /><em className="on" /><em /></div><h3>Bot-free, in your browser</h3><p>Record in Chrome, Edge or Safari. No bot joins the call.</p></article>
    <article className="otm-c otm-c3"><h3>See the words, as they’re spoken</h3><p>Live transcription as you talk, with one-key speaker switching.</p>
      <div className="otm-live" aria-hidden><span><i />Good morning, everyone. Let’s dive into this month’s strategy review.</span><span><i />Sure. We’ve seen some improvements in</span><div><u /><u /><b /></div></div></article>
    <article className="otm-c otm-c4"><h3>Get a quick overview</h3><p>An extractive overview, keywords and an outline for every conversation.</p><div className="otm-doc" aria-hidden><b>All Hands</b><s /><u /><u /><u /></div></article>
    <article className="otm-c otm-c5"><h3>Automate the action items</h3><p>Phrases like “I’ll…” and “can you…” become action items you can tick off.</p>
      <div className="otm-todo" aria-hidden><span>Review performance metrics</span><span>Review new customer experience</span><span>Submit feedback for friday</span></div></article>
    <article className="otm-c otm-c6"><h3>Export anywhere</h3><p>Download Markdown, plain text or SRT subtitles for any conversation.</p>
      <div className="otm-chips" aria-hidden>{chips.map(c => <em key={c}>✦ {c}</em>)}</div></article>
    <article className="otm-c otm-c7"><h3>Search every conversation</h3><p>Search across titles, transcripts and notes from one box.</p><Phone className="otm-phone--chan" /></article>
    <Link className="otm-btn otm-btn--blue otm-free" href="/login">Start for free</Link>
  </section>;
}

export function LandingMobileMore() {
  return <section className="otm otm--ex">
    <article className="otm-c otm-c8"><h3>Choose how you capture</h3><p>Record live in your browser, or import a .txt, .vtt or .srt transcript you already have.</p><div className="otm-lap" aria-hidden><i /><b /></div></article>
    <article className="otm-c otm-c9"><h3>Your data stays in your browser</h3><p>Conversations are stored locally in your browser. There is no sync and no sharing.</p>
      <div className="otm-sec" aria-hidden><b>Security settings</b><span><em>Stored locally</em><i /></span><span><em>No sync</em><i /></span><span><em>Export any time</em><i /></span></div></article>
    <article className="otm-c otm-c10"><h3>Open source</h3><p>The code is Apache-2.0 on GitHub. Read it, fork it or send a fix.</p>
      <div className="otm-orbs" aria-hidden><i /><i /><i /><i /></div></article>
  </section>;
}
