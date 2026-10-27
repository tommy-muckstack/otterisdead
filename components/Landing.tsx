import Link from "next/link";
import { OtPricing } from "@/components/OtPricing";
import { LandingMobileTop, LandingMobileMore } from "@/components/LandingMobile";
import "@/app/landing.css";

// Home page laid out like otter.ai: light hero with product card, pastel feature cards, blue pricing band, black footer.
// Marks, copy and artwork are our own.
const REPO = "https://github.com/tommy-muckstack/otterisdead";
const Mark = ({ h = 20 }: { h?: number }) => <svg height={h} viewBox="0 0 44 18" aria-hidden><rect x="0" y="0" width="14" height="18" rx="7" fill="none" stroke="#144FFF" strokeWidth="3.4" /><rect x="17" y="1" width="3.6" height="16" rx="1.8" fill="#144FFF" /><rect x="23.5" y="4" width="3.6" height="10" rx="1.8" fill="#144FFF" /><circle cx="35" cy="9" r="4" fill="#144FFF" /></svg>;
const Dn = () => <svg width="8" height="5" viewBox="0 0 8 5" aria-hidden style={{ marginLeft: 6 }}><path d="M1 1l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
const Win = () => <div className="ot-win" aria-hidden><div className="ot-win__bar"><i /><i /><i /></div><div className="ot-win__side">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div><div className="ot-win__main"><b /><s /><u /><u /><u /><u /><u /><u /></div></div>;
const Logos = ["Free", "Open source", "Apache-2.0", "No plans", "No card", "No bot", "In your browser", "SRT export"];
const chips = ["Sales", "Education", "Media", "Research", "Interviews"];
const apps: [string, string][][] = [[["Paste text", "Paste a transcript and it is split into speaker-labelled lines."], ["VTT & SRT", "Import subtitle files and keep their timestamps."], ["Audio", "Attach an audio file and click any timestamp to seek."]], [["Markdown", "Export the overview, outline and transcript as Markdown."], ["SRT", "Export subtitles for your video editor."], ["Plain text", "Copy a clean transcript into any app."]]];
const carA: [string, string][] = [["Paste text", "Paste a transcript and it is split into speaker-labelled lines."], ["VTT & SRT", "Import subtitle files and keep their timestamps."], ["Audio", "Attach an audio file and click any timestamp to seek."], ["TXT", "Import a plain .txt transcript."]];
const carB: [string, string][] = [["Markdown", "Export the overview, outline and transcript as Markdown."], ["SRT", "Export subtitles for your video editor."], ["Plain text", "Copy a clean transcript into any app."], ["Search", "Find any line across every conversation."]];
const arts = ["Sending a file takes three moves", "Meeting notes template with action items: your guide to productive meetings", "How to run a meeting like a pro: strategies and tips", "Speech to text for your own recordings", "What are AI agents? A guide to types, benefits, and examples", "Making meetings more productive with the best AI notetaker", "How to generate a transcript: a complete guide", "Chat with your own meeting history", "Transcript generator for any video"];

export function Landing({ page }: { page?: "pricing" } = {}) {
  return <div className={"ot" + (page === "pricing" ? " is-pr" : "")}>
    <header className="ot-nav"><Link href="/" className="ot-logo"><Mark h={22} /></Link>
      <nav><button>Use Cases<Dn /></button><button>Resources<Dn /></button><button>Download<Dn /></button><Link href="/pricing">Enterprise</Link><Link href="/pricing">Pricing</Link></nav>
      <div className="ot-nav__r"><Link href="/pricing">See pricing</Link><Link href="/login">Log in</Link><i /><Link href="/login" className="ot-btn ot-btn--nav">Start for free</Link></div></header>
    {page !== "pricing" && <LandingMobileTop />}
    <section className="ot-hero"><div className="ot-hero__l"><h1>Meeting notes for<br /><span>follow-ups</span></h1><p>Live transcription. Speaker labels. Action items. Markdown and SRT export.</p>
      <div className="ot-row"><Link href="/login" className="ot-btn ot-btn--blue">Start for free</Link><Link href="/pricing" className="ot-btn ot-btn--line">See pricing</Link></div>
      <div className="ot-quote"><i aria-hidden /><p>“Every feature is free. No plans, no seats, no trial that runs out.”</p><small>— The OtterIsDead promise</small></div></div>
      <div className="ot-hero__card"><Win /></div></section>
    <section className="ot-logos">{Logos.map(l => <span key={l}>{l}</span>)}</section>
    <section className="ot-ba"><h2>Before, during, and after every meeting.</h2>
      <p className="ot-lede">Transcribes live in your browser, labels who said what, and pulls out action items when the meeting ends.</p>
      <Link className="ot-btn ot-btn--line ot-demo" href="/login">Demo it live</Link>
      <article className="ot-card ot-card--a"><h3>Capture conversations in your browser</h3><p>Record with live speech recognition in Chrome, Edge or Safari, or import .txt, .vtt and .srt files.</p><div className="ot-art ot-art--rec" /></article>
      <article className="ot-card ot-card--b"><h3>Speaker labels</h3><p>Switch speakers with one key while you record, and rename a speaker once for every line.</p><div className="ot-art ot-art--brief"><b>Tuesday, 2:00 pm</b><s /><u /><u /></div></article>
      <article className="ot-card ot-card--c"><h3>Ask your transcript</h3><p>A local Ask returns the most relevant lines from your meeting, and search covers every title, transcript and note.</p><div className="ot-art ot-art--phone"><i /></div></article>
      <article className="ot-card ot-card--d"><h3>Highlights and notes</h3><p>Highlight the lines that matter, edit any line, and keep meeting notes next to the transcript.</p><div className="ot-art ot-art--face"><i /></div></article>
      <article className="ot-card ot-card--e"><h3>Action items, detected</h3><p>Phrases like “I’ll…” and “can you…” become action items with an owner you can tick off.</p><div className="ot-art ot-art--todo"><i /><i /><i /></div></article>
      <article className="ot-card ot-card--f"><h3>Export anywhere</h3><p>Download Markdown, plain text or SRT subtitles for any conversation.</p><div className="ot-art ot-art--chips">{["Markdown", "Text", "SRT", "VTT import", "TXT import", "Audio seek", "Highlights"].map(c => <em key={c}>✦ {c}</em>)}</div></article>
      <Link className="ot-btn ot-btn--blue ot-sfree" href="/login">Start for free</Link></section>
    <section className="ot-who"><h2>Whatever you do, it works for you</h2><div className="ot-chips">{chips.map((c, i) => <span key={c} className={i === 2 ? "on" : ""}>{c}</span>)}</div>
      <div className="ot-orb" aria-hidden /><h3>Media</h3><p>Capture interviews and production meetings as searchable transcripts, with highlighted lines and notes.</p>
      <button className="ot-arrow ot-arrow--l" aria-label="Previous">←</button><button className="ot-arrow ot-arrow--r" aria-label="Next">→</button><Link className="ot-btn ot-btn--line ot-learn" href="/pricing">Learn more</Link></section>
    {page !== "pricing" && <LandingMobileMore />}
    <section className="ot-trust"><h2>Built in the open</h2><p className="ot-sub">Read the code and decide for yourself.</p>
      <div className="ot-t ot-t--dark1"><i aria-hidden /><blockquote>“Conversations stay in your browser. There is no sync and no bot that joins your calls.”<small>— How OtterIsDead works</small></blockquote></div>
      <div className="ot-t ot-t--logos1"><span>Free</span><span>Open source</span></div>
      <div className="ot-t ot-t--press"><h4>GitHub</h4><p>Open source</p><p>OtterIsDead is Apache-2.0 on GitHub. Read every line, report a bug or send a fix.</p><small>Learn more</small></div>
      <div className="ot-t ot-t--logos2"><span>Apache-2.0</span><span>No card</span></div>
      <div className="ot-t ot-t--stat"><b>$0</b><p>For every feature</p><p>No plans, no seats and no trial clock. Everything is included for everyone.</p></div>
      <div className="ot-t ot-t--dark2"><i aria-hidden /><blockquote>“Summaries and action items are rule-based and computed in your browser.”<small>— How the insights work</small></blockquote></div></section>
    <section className="ot-conn"><h2>Bring transcripts in and out</h2><p className="ot-sub2">Import text, VTT and SRT files, attach audio, and export Markdown, plain text or SRT.</p>
      {apps.map((row, r) => <div key={r} className={"ot-apps ot-apps--" + r}>{row.map(([n, d]) => <div key={n}><i aria-hidden /><h4>{n}</h4><p>{d}</p></div>)}</div>)}
      <div className="otm-car" aria-hidden>{[carA, carB].map((row, r) => <div key={r} className={"otm-car__row otm-car__row--" + r}>{row.map(([n, d]) => <div key={n}><i /><h4>{n}</h4><p>{d}</p></div>)}</div>)}</div>
      <Link className="ot-btn ot-btn--black" href="/login">Start for free</Link></section>
    <section className="ot-blue"><h2>Flexible plans for teams, individuals, and enterprises</h2>
      <div className="ot-plan ot-plan--1"><em>Basic</em><h3>Get started for free</h3><h5>Free forever</h5><p>Perfect for individuals and small teams looking to transcribe and summarize their meetings effortlessly.</p><b>Features</b><ul><li>Automated AI meeting summaries</li><li>Unlimited meetings</li><li>Live transcription in your browser</li></ul><Link className="ot-btn ot-btn--ghostw" href="/login">Start for free</Link></div>
      <div className="ot-plan ot-plan--2"><em>Business</em><h3>From $0/month, always</h3><h5>No trial needed</h5><p>Ideal for teams that want to collaborate seamlessly and turn meetings into actionable outcomes.</p><b>Everything in Basic, plus</b><ul><li>Unlimited transcription minutes</li><li>Speaker labels and highlights</li><li>Import and transcribe audio or video files</li><li>Open source under Apache-2.0</li></ul><Link className="ot-btn ot-btn--ghostw" href="/login">Start for free</Link></div>
      <div className="ot-plan ot-plan--3"><em>Enterprise</em><h3>Need a custom solution?</h3><p>Talk to the maintainers about advanced setups.</p><Link className="ot-btn ot-btn--ghostw" href={REPO}>Contact us</Link></div>
      <div className="ot-ovals" aria-hidden>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
      <h2 className="ot-ke">Transcripts, notes and action items, free</h2>
      <div className="ot-row2"><Link className="ot-btn ot-btn--white" href="/login">Start for free</Link><Link className="ot-btn ot-btn--glass" href="/login">Demo it live</Link></div>
      <h2 className="ot-rel">Browse related articles</h2><ul className="ot-arts">{arts.map(a => <li key={a}><Link href="/pricing">{a}</Link></li>)}</ul></section>
    {page === "pricing" && <OtPricing />}
    <footer className="ot-foot"><Mark h={26} />
      <div><h6>Use cases</h6>{["Sales", "Education", "Media", "SDR Agent", "Recruiting Agent"].map(x => <Link key={x} href="/pricing">{x}</Link>)}</div>
      <div><h6>Resources</h6>{["Help Center", "Careers", "Press", "Blog"].map(x => <Link key={x} href="/pricing">{x}</Link>)}</div>
      <div><h6>Get it</h6><Link href="/login">Web app</Link><Link href={REPO}>Source code</Link></div>
      <div><h6>Social</h6><Link href={REPO}>LinkedIn</Link><Link href={REPO}>YouTube</Link><Link href={REPO}>X</Link></div>
      <p className="ot-ghost" aria-hidden>OtterIsDead</p>
      <nav className="ot-legal"><span>© 2026 OtterIsDead</span><Link href="/pricing">Privacy policy</Link><Link href="/pricing">Terms of service</Link><Link href={REPO + "/blob/main/LICENSE"}>Open source license</Link><Link href="/pricing">Your Privacy Choices</Link><Link href={REPO}>Status</Link></nav></footer>
  </div>;
}
