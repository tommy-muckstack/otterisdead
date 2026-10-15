import type { Site } from "@/lib/site-types";
const GH = "https://github.com/tommy-muckstack/otterisdead";
export const site: Site = {
  slug: "otterisdead", name: "OtterIsDead", replaces: "Otter.ai", theme: "otter",
  glyph: "M3 12 L3 12 M6 9 L6 15 M9.5 5 L9.5 19 M13 8 L13 16 M16.5 3.5 L16.5 20.5 M20 9 L20 15",
  nav: [{ label: "Product", id: "product" }, { label: "Use cases", id: "solutions" }, { label: "Resources", id: "resources" }, { label: "Pricing", id: "pricing" }],
  cta: "Start for free",
  hero: { variant: "center", eyebrow: "Free · Open source · Your recordings stay in your browser", title: ["Every meeting,", "written down for you."], subtitle: "Record a conversation and watch the transcript appear. Get a summary, action items with owners, and a searchable archive, without paying per seat or sending your audio to our servers.",
    primary: { label: "Open the demo", href: "/login" }, secondary: { label: "See pricing", href: "/#pricing" }, shot: "meeting.png", shotAlt: "The OtterIsDead conversation page with a speaker-labelled transcript on the left and a summary, keywords and outline on the right" },
  audience: "For founders, researchers, students and teams who live in calls and are tired of paying per person to remember them",
  stepsTitle: "From a conversation to notes in three moves",
  steps: [{ t: "Record or import", d: "Hit record for live transcription, or paste a transcript or subtitle file from any other tool." }, { t: "Read the gist", d: "An instant overview, keywords and outline help you skim an hour in thirty seconds." }, { t: "Follow through", d: "Action items get an owner and a due word. Tick them off, or export the whole page." }],
  rows: [
    { id: "product", k: "Live transcript", h: "Words on the page while people are still talking", p: "Live transcription runs in your browser. Switch speakers with a number key, jot notes alongside, and keep a copy of the audio on your own device.", img: "record.png", alt: "The recorder with a live transcript and speaker buttons", cta: "Try a demo recording" },
    { id: "solutions", k: "Action items", h: "Never ask “who was doing that?” again", p: "Commitments like “I'll send the notes by Friday” are pulled out with who said them and when they are due. Add your own, check them off, and jump back to the moment in the transcript.", img: "actions.png", alt: "The action items panel with owners and due dates", cta: "See action items" },
    { id: "resources", k: "Search", h: "Find that one thing someone said in March", p: "Search every transcript, title and note at once. Rename speakers once and every line follows. Highlight the lines worth keeping.", img: "search.png", alt: "Search results across several conversations", cta: "Search the archive" },
  ],
  statsTitle: "Plain numbers",
  stats: [{ b: "$0", s: "per person, per month, forever" }, { b: "0 minutes", s: "of monthly transcription caps" }, { b: "3 formats", s: "export Markdown, text and SRT subtitles" }, { b: "Apache-2.0", s: "read the code, fork it, host it" }],
  integrations: { title: "Bring a transcript from anywhere", text: "Paste text, or drop in a .txt, .vtt or .srt file from a call you recorded elsewhere. Export the same formats back out." },
  pricing: { title: "What you'd pay for meeting notes elsewhere", vendor: "Otter.ai", asOf: "October 2026", plans: [{ name: "Pro", perSeatMonth: 17, note: "billed monthly, per user" }, { name: "Business", perSeatMonth: 30, note: "billed monthly, per user" }], seats: 5,
    footnote: "Otter.ai's free plan limits monthly minutes and imports. Its paid plans add team features and AI chat that we don't match: our summaries are extractive and run locally, and speech recognition quality depends on your browser.", featuresTitle: "What you get, with no plan gates",
    features: [{ name: "Live transcription (browser speech recognition)", plan: "Free" }, { name: "Unlimited recording length", plan: "Pro" }, { name: "Import transcripts and subtitle files", plan: "Pro" }, { name: "Action items with owners and due dates", plan: "Pro" }, { name: "Search across every conversation", plan: "Free" }, { name: "Export to Markdown, text and SRT", plan: "Pro" }] },
  finalCta: { title: "Stop taking notes. Start listening.", sub: "Open the demo and run a recording in one click." },
  footer: [
    { title: "Product", links: [{ label: "Live transcript", href: "/#product" }, { label: "Action items", href: "/#solutions" }, { label: "Search", href: "/#resources" }, { label: "Pricing", href: "/#pricing" }] },
    { title: "Get started", links: [{ label: "Log in", href: "/login" }, { label: "Try the demo account", href: "/login" }, { label: "Price comparison", href: "/#pricing" }] },
    { title: "Open source", links: [{ label: "GitHub", href: GH }, { label: "Apache-2.0 license", href: GH + "/blob/main/LICENSE" }] },
    { title: "More IsDead apps", links: [{ label: "NotionIsDead", href: "/notionisdead" }, { label: "LinearIsDead", href: "/linearisdead" }, { label: "AirtableIsDead", href: "/airtableisdead" }, { label: "1PasswordIsDead", href: "/onepasswordisdead" }] },
  ],
  trademark: "OtterIsDead is an independent open-source project. It is not affiliated with, endorsed by or sponsored by Otter.ai, Inc. Otter.ai is a trademark of its owner.",
  repo: GH,
};
