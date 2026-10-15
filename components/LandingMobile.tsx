import Link from "next/link";
import "@/app/landing-m.css";

// Phone-width home (<=760px), laid out like otter.ai's "Conversational Knowledge Engine" mobile variant.
// Desktop uses <Landing/>; these sections are hidden above 760px. Artwork is our own CSS.
const Win = () => <div className="ot-win" aria-hidden><div className="ot-win__bar"><i /><i /><i /></div><div className="ot-win__side">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div><div className="ot-win__main"><b /><s /><u /><u /><u /><u /><u /><u /></div></div>;
const Phone = ({ className = "" }: { className?: string }) => <div className={"otm-phone " + className} aria-hidden><i /><b /><s /><u /></div>;
const Logos = ["Salesforce", "HARVARD", "NBC"];
const chips = ["Needs", "Timeline", "Budget", "Authority", "Pain Points", "Urgency & Priorities", "Scale"];

export function LandingMobileTop() {
  return <section className="otm">
    <div className="otm-hero">
      <h1>Your AI notetaker is now also your Conversational Knowledge Engine</h1>
      <p>Otter transcribes every meeting, turning it into searchable knowledge that powers your workflow.</p>
      <div className="otm-row"><Link href="/login" className="otm-btn otm-btn--blue">Start for free</Link><Link href="/pricing" className="otm-btn otm-btn--line">Schedule demo</Link></div>
      <div className="otm-vid" aria-hidden><Win /></div>
      <i className="otm-av" aria-hidden />
      <p className="otm-q">“I use Otter.ai almost everyday….it is a superpower.”</p>
      <p className="otm-by">— A very happy early user, Head of Enablement</p>
      <span className="otm-dash" aria-hidden><i /><i /><b /></span>
    </div>
    <div className="otm-logos">{Logos.map(l => <span key={l}>{l}</span>)}</div>
    <h2>Like having your own executive assistant</h2>
    <p className="otm-lede">Send it to meetings, or record them from your device. Otter captures the full conversation, tracks takeaways, and handles follow-ups without ever taking a day off.</p>
    <Link href="/login" className="otm-btn otm-btn--line otm-demo">Demo it live</Link>
    <article className="otm-c otm-c1"><h3>Ask Otter anything</h3><p>Otter AI Chat searches across your meetings and connected apps to instantly answer questions and help you create follow-ups, reports, and content.</p><Phone className="otm-phone--chat" /></article>
    <article className="otm-c otm-c2"><div className="otm-dock" aria-hidden><em /><em /><em className="on" /><em /></div><h3>A desktop app for bot-free meetings</h3><p>Record conversations directly from your Mac or Windows desktop, without bots joining the call.</p></article>
    <article className="otm-c otm-c3"><h3>See the words, as they’re spoken</h3><p>Live transcription in multiple languages, and speaker recognition.</p>
      <div className="otm-live" aria-hidden><span><i />Good morning, everyone. Let’s dive into this month’s strategy review.</span><span><i />Sure. We’ve seen some improvements in</span><div><u /><u /><b /></div></div></article>
    <article className="otm-c otm-c4"><h3>Get instant summaries you can trust</h3><p>Otter turns every meeting into a clear summary with decisions, action items, and insights.</p><div className="otm-doc" aria-hidden><b>All Hands</b><s /><u /><u /><u /></div></article>
    <article className="otm-c otm-c5"><h3>Automate the action items</h3><p>Clear next steps are automatically captured and assigned from every meeting.</p>
      <div className="otm-todo" aria-hidden><span>Review performance metrics</span><span>Review new customer experience</span><span>Submit feedback for friday</span></div></article>
    <article className="otm-c otm-c6"><h3>Push sales insights to your CRM</h3><p>Key deal details, notes, and next steps automatically extracted from every meeting and synced to your CRM.</p>
      <div className="otm-chips" aria-hidden>{chips.map(c => <em key={c}>✦ {c}</em>)}</div></article>
    <article className="otm-c otm-c7"><h3>Organize your conversations with Channels</h3><p>Meetings grouped by team, project, or topic so everyone can find recordings and collaborate in one shared space.</p><Phone className="otm-phone--chan" /></article>
    <Link className="otm-btn otm-btn--blue otm-free" href="/login">Start for free</Link>
  </section>;
}

export function LandingMobileMore() {
  return <section className="otm otm--ex">
    <article className="otm-c otm-c8"><h3>Choose how you capture meetings</h3><p>Whether you automatically send your AI Notetaker to meetings, record bot-free on desktop or Chrome, or capture on mobile, Otter gives you flexible ways to record meetings anywhere.</p><div className="otm-lap" aria-hidden><i /><b /></div></article>
    <article className="otm-c otm-c9"><h3>Scale with your company</h3><p>Otter is built with the security, governance, and compliance controls enterprises expect.</p>
      <div className="otm-sec" aria-hidden><b>Security settings</b><span><em>Two-Factor Authentication</em><i /></span><span><em>Meeting Access Controls</em><i /></span><span><em>Export Restrictions</em><i /></span></div></article>
    <article className="otm-c otm-c10"><h3>Pull meeting knowledge into your favorite AI chat</h3><p>ChatGPT, Claude, and other AI chat tools can securely access your meeting knowledge through Otter’s MCP Server for deeper analysis and smarter workflows.</p>
      <div className="otm-orbs" aria-hidden><i /><i /><i /><i /></div></article>
  </section>;
}
