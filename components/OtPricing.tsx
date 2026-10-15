"use client";
import Link from "next/link";
import { useState } from "react";
import data from "@/lib/otPricingData.json";
import "@/app/ot-pricing.css";

// Bespoke recreation of otter.ai/pricing between the nav and the footer. Plan names and feature rows follow the original;
// wordmarks are plain text and all art is CSS.
const Chk = ({ s = 16 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden><path d="M7.75 12.75L10 15.25L16.25 8.75" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
type Item = { t: React.ReactNode; b?: boolean; n?: boolean };
const plans: { name: string; sub: string; val: React.ReactNode; valM?: React.ReactNode; save?: string; saveM?: string; cta: string; best?: boolean; top: Item[]; lead?: string; rest: Item[] }[] = [
  { name: "Basic", sub: "For those who want to give it a try", val: <b>Free</b>, cta: "Get started",
    top: [{ t: "Zoom, MS Teams, and Google Meet", b: true }, { t: "AI Chat within and across meetings", b: true }, { t: "AI meeting workflows", b: true, n: true }, { t: "3 lifetime audio/video file imports" }, { t: "Live transcription" }, { t: "Speaker identification" }, { t: "Audio recording playback" }, { t: "Multi-language support" }, { t: "iOS and Android apps" }, { t: "300 monthly transcription minutes" }, { t: "Otter MCP server", n: true }], rest: [] },
  { name: "Pro", sub: "For individuals and small teams", val: <><b>$8<sup>.33</sup></b><span>/user/month</span></>, valM: <><b>$16<sup>.99</sup></b><span>/user/month</span></>, save: "save 51%", cta: "Buy now",
    top: [{ t: "1200 in-app recording minutes", b: true }, { t: "Advanced AI workflows", b: true }, { t: "10 monthly audio/video file imports", b: true }], lead: "Everything in Basic, plus",
    rest: [{ t: <>Up to <b>90 mins</b>/meeting</> }, { t: "Advanced meeting templates", n: true }, { t: "Unlimited storage" }, { t: "Team vocabulary & taggable speakers" }, { t: "Advanced search, export & playback" }, { t: "Salesforce*, HubSpot*, Zapier integrations", n: true }] },
  { name: "Business", sub: "For medium-sized teams", val: <><b>$19<sup>.99</sup></b><span>/user/month</span></>, valM: <><b>$30</b><span>/user/month</span></>, save: "save 33%", cta: "Buy now", best: true,
    top: [{ t: "Unlimited meetings + in-app recordings", b: true }, { t: "Custom AI workflows", b: true }, { t: "Unlimited audio/video file imports*", b: true }], lead: "Everything in Pro, plus",
    rest: [{ t: <>Up to <b>4 hours</b>/meeting</> }, { t: "Enhanced admin features: activity logs, usage analytics, and more" }, { t: "Join 3 concurrent meetings" }, { t: "Prioritized support" }] },
  { name: "Enterprise", sub: "For large teams and companies", val: null, cta: "Schedule a demo",
    top: [{ t: "Unlimited custom AI workflows", b: true }, { t: "Otter Sales Notetaker", b: true }, { t: "Custom integrations (CRM, dialers)", b: true }], lead: "Everything in Business, plus",
    rest: [{ t: "SSO, SCIM, Domain Capture" }, { t: "Enterprise-grade security & controls" }, { t: "HIPAA compliance (add-on)" }, { t: "Otter API & Webhooks" }, { t: "Video replay for Zoom and Google Meet" }, { t: "AI Chat with Gmail, Google Drive, Notion, Jira", n: true }, { t: "Customer Success Program" }] },
];
const logos = ["salesforce", "HARVARD", "NBC UNIVERSAL", "amazon", "IBM", "GRANT THORNTON", "Walgreens", "mastercard"];
const hdr: [string, string, string, string][] = [["Basic", "Free", "forever", "Get started"], ["Pro", "$8.33", "user/month", "Buy now"], ["Business", "$19.99", "user/month", "Buy now"], ["Enterprise", "", "", "Schedule a demo"]];
const Tag = () => <em className="otp-new">New</em>;

export function OtPricing() {
  const [annual, setAnnual] = useState(true);
  const [shut, setShut] = useState<Record<number, boolean>>({});
  const [faq, setFaq] = useState<number | null>(null);
  const groups = data.groups as [string, [string, (string | number)[], number][]][];
  return <div className="otp">
    <section className="otp-hero"><h1>Choose the plan that’s right for you</h1>
      <div className="otp-tabs"><button className={annual ? "" : "on"} onClick={() => setAnnual(false)}>Monthly</button><button className={annual ? "on" : ""} onClick={() => setAnnual(true)}>Annual <i>save 51%</i></button></div>
      <p className="otp-usd">Prices in USD</p>
      <div className="otp-plans">{plans.map(p => <article key={p.name} className={"otp-plan" + (p.best ? " is-best" : "")}>
        {p.best && <span className="otp-bar" />}
        <header><h3>{p.name}{p.best && <small>BEST VALUE</small>}</h3><p>{p.sub}</p>
          <div className="otp-val">{p.val ? <div className="otp-val__row">{annual || !p.valM ? p.val : p.valM}</div> : null}{p.save && <span className="otp-save">{annual ? p.save : p.name === "Pro" ? "save 51%" : "20% off for 3 months+"}</span>}</div>
          <Link href="/login" className={"otp-btn" + (p.best ? " otp-btn--blue" : "")}>{p.cta}</Link></header>
        <ul>{p.top.map((it, i) => <li key={i} className={it.b ? "b" : ""}><Chk />{it.n && <Tag />}<span>{it.t}</span></li>)}</ul>
        {p.lead && <><hr /><h5>{p.lead}</h5></>}
        {p.rest.length > 0 && <ul>{p.rest.map((it, i) => <li key={i}><Chk />{it.n && <Tag />}<span>{it.t}</span></li>)}</ul>}</article>)}</div>
      <p className="otp-foot">*Plans shown for comparison. Everything in OtterIsDead is free and open source.</p></section>
    <section className="otp-logos">{logos.map(l => <span key={l}>{l}</span>)}</section>
    <section className="otp-tbl">
      <div className="otp-tbl__h">{hdr.map(([n, pr, u, c], i) => <div key={n}><h4>{n}</h4>{pr && <p><b>{i === 1 && !annual ? "$16.99" : i === 2 && !annual ? "$30" : pr}</b> <small>{u}</small></p>}<Link href="/login" className={"otp-btn otp-btn--s" + (i === 2 ? " otp-btn--blue" : "")}>{c}</Link></div>)}</div>
      <div className="otp-tbl__b">{groups.map(([g, rows], gi) => <div key={g} className="otp-grp">
        <button type="button" className="otp-grp__h" aria-expanded={!shut[gi]} onClick={() => setShut({ ...shut, [gi]: !shut[gi] })}><h4>{g}</h4><svg width="33" height="33" viewBox="0 0 24 24" aria-hidden style={{ transform: shut[gi] ? "rotate(45deg)" : undefined }}><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
        {!shut[gi] && rows.map(([t, cells, h]) => <div key={t} className="otp-row" style={{ height: h }}><span>{t}</span>{cells.map((c, i) => <div key={i}>{c === 1 ? <Chk s={23} /> : <small>{c}</small>}</div>)}</div>)}</div>)}</div>
      <p className="otp-notes">* Shared pool across all transcription types<br />* Offer valid for first-time subscribers only</p>
    </section>
    <section className="otp-faq"><h2>Frequently Asked Questions</h2>
      <div>{data.faqs.map(([q, a], i) => <details key={q} open={faq === i} onClick={e => { e.preventDefault(); setFaq(faq === i ? null : i); }}><summary><span>{q}</span><i aria-hidden>{faq === i ? "−" : "+"}</i></summary><p>{a}</p></details>)}</div></section>
    <section className="otp-cta"><div className="otp-cta__ov" aria-hidden>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div><h2>The world’s smartest AI Notetaker</h2>
      <div><Link href="/login" className="otp-btn otp-btn--w">Start for free</Link><Link href="/login" className="otp-btn otp-btn--g">Demo it live</Link></div></section>
  </div>;
}
