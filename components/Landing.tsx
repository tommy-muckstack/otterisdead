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
const Logos = ["Salesforce", "HARVARD", "NBC", "amazon", "IBM", "Grant Thornton", "Walgreens", "mastercard"];
const chips = ["Sales", "Education", "Media", "Recruiting Agent", "SDR Agent"];
const apps: [string, string][][] = [[["Zoom", "Invite your AI meeting agent for automatic real-time transcription, key takeaways and action items."], ["Claude", "Ground AI-generated answers in your team's meeting knowledge for more accurate, reliable results."], ["Dropbox", "Use meeting transcripts and summaries to keep shared folders organized and current."]], [["HubSpot", "Sync transcripts and notes to automatically push insights into your CRM."], ["Jira", "Keep projects moving forward by sending key takeaways and action items from every conversation."], ["Notion", "Seamlessly sync your transcripts, notes, and key takeaways for better organization and collaboration."]]];
const carA: [string, string][] = [["Claude", "Ground AI-generated answers in your team's meeting knowledge for more accurate, reliable results."], ["Dropbox", "Upload any audio and video files, and they’ll be automatically transcribed into searchable and shareable text."], ["Google Calendar", "Schedule your AI Meeting Agent to automatically join all your Zoom, Microsoft Teams, and Google Meet meetings."], ["Google Docs", "Sync transcriptions and meeting notes for easy editing, sharing, and collaboration with all your teammates."]];
const carB: [string, string][] = [["Slack", "Instantly share transcripts, summaries, and key takeaways making sure your team is always on the same page."], ["Asana", "Stay on track by automatically turning your meeting notes into simple action items with deadlines."], ["HubSpot", "Log meeting transcripts and notes to automatically push sales insights to your CRM."], ["Jira", "Keep projects moving forward by automatically sending key takeaways and action items from every conversation."]];
const arts = ["Sending a file takes three moves", "Meeting notes template with action items: your guide to productive meetings", "How to run a meeting like a pro: strategies and tips", "Speech to text for your own recordings", "What are AI agents? A guide to types, benefits, and examples", "Making meetings more productive with the best AI notetaker", "How to generate a transcript: a complete guide", "Chat with your own meeting history", "Transcript generator for any video"];

export function Landing({ page }: { page?: "pricing" } = {}) {
  return <div className={"ot" + (page === "pricing" ? " is-pr" : "")}>
    <header className="ot-nav"><Link href="/" className="ot-logo"><Mark h={22} /></Link>
      <nav><button>Use Cases<Dn /></button><button>Resources<Dn /></button><button>Download<Dn /></button><Link href="/pricing">Enterprise</Link><Link href="/pricing">Pricing</Link></nav>
      <div className="ot-nav__r"><Link href="/pricing">Schedule demo</Link><Link href="/login">Log in</Link><i /><Link href="/login" className="ot-btn ot-btn--nav">Start for free</Link></div></header>
    {page !== "pricing" && <LandingMobileTop />}
    <section className="ot-hero"><div className="ot-hero__l"><h1>Meeting AI for<br /><span>follow-ups</span></h1><p>Transcription. Pre-call briefs. Live coaching. Automatic follow-ups.</p>
      <div className="ot-row"><Link href="/login" className="ot-btn ot-btn--blue">Start for free</Link><Link href="/pricing" className="ot-btn ot-btn--line">Schedule demo</Link></div>
      <div className="ot-quote"><i aria-hidden /><p>“I use it almost everyday… it is a superpower.”</p><small>— A very happy early user, Head of Enablement</small></div></div>
      <div className="ot-hero__card"><Win /></div></section>
    <section className="ot-logos">{Logos.map(l => <span key={l}>{l}</span>)}</section>
    <section className="ot-ba"><h2>Before, during, and after every meeting.</h2>
      <p className="ot-lede">Briefs you before the call, coaches you based on what's been said, and automatically follows up in the tools you already use.</p>
      <Link className="ot-btn ot-btn--line ot-demo" href="/login">Demo it live</Link>
      <article className="ot-card ot-card--a"><h3>Capture conversations from anywhere</h3><p>Record directly from your Mac or Windows desktop, mobile device, or your browser.</p><div className="ot-art ot-art--rec" /></article>
      <article className="ot-card ot-card--b"><h3>Pre-call briefings</h3><p>Briefing documents delivered before your meeting with all the prior discussions, action items, and updates you need.</p><div className="ot-art ot-art--brief"><b>Tuesday, 2:00 pm</b><s /><u /><u /></div></article>
      <article className="ot-card ot-card--c"><h3>Ask anything</h3><p>AI chat searches across your meetings and connected apps to instantly answer questions and help you create follow-ups, reports, and content.</p><div className="ot-art ot-art--phone"><i /></div></article>
      <article className="ot-card ot-card--d"><h3>Live coaching</h3><p>Get real-time, personalized coaching and prompts during calls based on your entire conversation history, company playbooks, and what's being discussed.</p><div className="ot-art ot-art--face"><i /></div></article>
      <article className="ot-card ot-card--e"><h3>Automate the action items</h3><p>Next steps are automatically captured and assigned from every meeting.</p><div className="ot-art ot-art--todo"><i /><i /><i /></div></article>
      <article className="ot-card ot-card--f"><h3>Push sales insights to your CRM</h3><p>Key deal details, notes, and next steps automatically extracted from every meeting and synced to your CRM.</p><div className="ot-art ot-art--chips">{["Needs", "Timeline", "Budget", "Authority", "ROI", "Pain Points", "Urgency"].map(c => <em key={c}>✦ {c}</em>)}</div></article>
      <Link className="ot-btn ot-btn--blue ot-sfree" href="/login">Start for free</Link></section>
    <section className="ot-who"><h2>Whatever you do, it works for you</h2><div className="ot-chips">{chips.map((c, i) => <span key={c} className={i === 2 ? "on" : ""}>{c}</span>)}</div>
      <div className="ot-orb" aria-hidden /><h3>Media</h3><p>Capture interviews and production meetings and automatically turn them into searchable transcripts, key quotes, and draft-ready notes.</p>
      <button className="ot-arrow ot-arrow--l" aria-label="Previous">←</button><button className="ot-arrow ot-arrow--r" aria-label="Next">→</button><Link className="ot-btn ot-btn--line ot-learn" href="/pricing">Learn more</Link></section>
    {page !== "pricing" && <LandingMobileMore />}
    <section className="ot-trust"><h2>Trusted by teams, loved by people</h2><p className="ot-sub">But don't take our word for it.</p>
      <div className="ot-t ot-t--dark1"><i aria-hidden /><blockquote>“It's an incredible app. The most accurate app out there for transcription.”<small>— An early user</small></blockquote></div>
      <div className="ot-t ot-t--logos1"><span>Walgreens</span><span>NBC</span></div>
      <div className="ot-t ot-t--press"><h4>WSJ</h4><p>As seen in the press</p><p>Recognized as a must-try AI tool, with AI-powered summaries and action items that help teams follow up faster and work more efficiently.</p><small>Learn more</small></div>
      <div className="ot-t ot-t--logos2"><span>IBM</span><span>FAST COMPANY</span></div>
      <div className="ot-t ot-t--stat"><b>4<sup>+</sup></b><p>Hours saved per week</p><p>People report saving over four hours weekly by automating transcription and summaries.</p></div>
      <div className="ot-t ot-t--dark2"><i aria-hidden /><blockquote>“I easily save hours per week, without a doubt. That's an exponential amount of time savings.”<small>— A marketing manager</small></blockquote></div></section>
    <section className="ot-conn"><h2>Connect to your favorite apps</h2><p className="ot-sub2">Countless integrations automatically connect your meetings to tools like Slack, Zoom, Salesforce, Claude, Google Drive, and many others.</p>
      {apps.map((row, r) => <div key={r} className={"ot-apps ot-apps--" + r}>{row.map(([n, d]) => <div key={n}><i aria-hidden /><h4>{n}</h4><p>{d}</p></div>)}</div>)}
      <div className="otm-car" aria-hidden>{[carA, carB].map((row, r) => <div key={r} className={"otm-car__row otm-car__row--" + r}>{row.map(([n, d]) => <div key={n}><i /><h4>{n}</h4><p>{d}</p></div>)}</div>)}</div>
      <Link className="ot-btn ot-btn--black" href="/pricing">View integrations</Link></section>
    <section className="ot-blue"><h2>Flexible plans for teams, individuals, and enterprises</h2>
      <div className="ot-plan ot-plan--1"><em>Basic</em><h3>Get started for free</h3><h5>Free forever</h5><p>Perfect for individuals and small teams looking to transcribe and summarize their meetings effortlessly.</p><b>Features</b><ul><li>Automated AI meeting summaries</li><li>Unlimited meetings</li><li>Basic integrations (Zoom, Google Meet, Teams, Slack)</li></ul><Link className="ot-btn ot-btn--ghostw" href="/login">Start for free</Link></div>
      <div className="ot-plan ot-plan--2"><em>Business</em><h3>From $0/month, always</h3><h5>No trial needed</h5><p>Ideal for teams that want to collaborate seamlessly and turn meetings into actionable outcomes.</p><b>Everything in Basic, plus</b><ul><li>Unlimited transcription minutes</li><li>Collaborative note editing</li><li>Import and transcribe audio or video files</li><li>Self-hosting if you want it</li></ul><Link className="ot-btn ot-btn--ghostw" href="/login">Start for free</Link></div>
      <div className="ot-plan ot-plan--3"><em>Enterprise</em><h3>Need a custom solution?</h3><p>Talk to the maintainers about advanced setups.</p><Link className="ot-btn ot-btn--ghostw" href={REPO}>Contact us</Link></div>
      <div className="ot-ovals" aria-hidden>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
      <h2 className="ot-ke">The world's only conversational knowledge engine, now free</h2>
      <div className="ot-row2"><Link className="ot-btn ot-btn--white" href="/login">Start for free</Link><Link className="ot-btn ot-btn--glass" href="/login">Demo it live</Link></div>
      <h2 className="ot-rel">Browse related articles</h2><ul className="ot-arts">{arts.map(a => <li key={a}><Link href="/pricing">{a}</Link></li>)}</ul></section>
    {page === "pricing" && <OtPricing />}
    <footer className="ot-foot"><Mark h={26} />
      <div><h6>Use cases</h6>{["Sales", "Education", "Media", "SDR Agent", "Recruiting Agent"].map(x => <Link key={x} href="/pricing">{x}</Link>)}</div>
      <div><h6>Resources</h6>{["Help Center", "Careers", "Press", "Blog"].map(x => <Link key={x} href="/pricing">{x}</Link>)}</div>
      <div><h6>Download</h6><Link href={REPO}>Desktop App</Link><span className="ot-qr" aria-hidden /><Link href={REPO}>iOS app</Link><Link href={REPO}>Android app</Link><Link href={REPO}>Chrome extension</Link></div>
      <div><h6>Social</h6><Link href={REPO}>LinkedIn</Link><Link href={REPO}>YouTube</Link><Link href={REPO}>X</Link></div>
      <p className="ot-ghost" aria-hidden>OtterIsDead</p>
      <nav className="ot-legal"><span>© 2026 OtterIsDead</span><Link href="/pricing">Privacy policy</Link><Link href="/pricing">Terms of service</Link><Link href={REPO + "/blob/main/LICENSE"}>Open source license</Link><Link href="/pricing">Your Privacy Choices</Link><Link href={REPO}>Status</Link></nav></footer>
  </div>;
}
