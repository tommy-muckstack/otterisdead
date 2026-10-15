import type { PBCfg } from "@/components/PricingBody";
export const pricingCfg: PBCfg = {
  vars: { "--gap": "0px", "--h1-color": "#2f6df0", "--plan-min": "540px", "--plan-bd": "1px solid #e3e6ee", "--ink": "#1a1a1f", "--accent": "#1b5cf0", "--soft": "#eaf0ff", "--hero-pt": "70px", "--hero-pb": "40px", "--h1": "44px", "--h1-ls": "-.5px", "--h-weight": "500", "--card-r": "12px", "--btn-r": "8px", "--plan-h2": "24px", "--plan-h2-lh": "30px", "--row": "48px", "--faq-bg": "#fff", "--faq-card": "#fff", "--cta-bg": "#fff", "--max": "1100px" } as Record<string, string>,
  title: "Choose the plan that’s right for you", toggle: ["Annual", "Monthly"],
  plans: [
    { name: "Basic", price: "Free", desc: "For individuals and small teams", cta: "Get started", lead: "Includes:", feats: ["300 monthly transcription minutes", "30 minutes per conversation", "3 lifetime file imports", "Live captions", "AI summaries"] },
    { name: "Pro", price: "$0", per: "/mo", desc: "For individuals and professionals", cta: "Get started", lead: "Everything in Basic, plus:", feats: ["1,200 monthly transcription minutes", "90 minutes per conversation", "10 imports per month", "Advanced search", "Export to Word, PDF"] },
    { name: "Business", price: "$0", per: "/mo", desc: "For teams that collaborate", cta: "Get started", hot: true, tag: "Most popular", lead: "Everything in Pro, plus:", feats: ["6,000 monthly transcription minutes", "4 hours per conversation", "Unlimited imports", "Admin controls", "Team analytics", "Custom vocabulary"] },
    { name: "Enterprise", price: "Custom", desc: "For organizations with advanced needs", cta: "Contact sales", lead: "Everything in Business, plus:", feats: ["SSO", "Custom retention", "Dedicated success manager", "Audit logs", "Priority support"] },
  ],
  tableTitle: "Compare plans", cols: ["Basic", "Pro", "Business", "Enterprise"],
  groups: [["Workspace Size", ["Number of workspace members", "Shared folders", "Groups"]], ["Automatic Transcription", ["Monthly transcription minutes", "Minutes per conversation", "Live transcription", "Custom vocabulary", "Speaker identification", "Import audio and video", "Export formats", "Search and playback"]], ["Recording & Playback", ["Record in browser", "Mobile app", "Calendar auto-join", "Playback speed", "Highlights", "Comments"]], ["Collaboration", ["Share links", "Team folders", "Mentions", "Live sharing", "Integrations"]], ["Meeting Templates", ["Meeting summaries", "Action items", "Follow-up emails"]], ["Administration & Security", ["SSO", "Admin console", "Retention controls", "Audit logs", "SOC 2"]]],
  faqTitle: "Frequently Asked Questions", faqs: [["My colleague and I already have Otter accounts. Can we switch to Business?", "Yes. Join the same workspace from settings."], ["What payment methods do you accept?", "Nothing is charged here. It is free and open source."], ["Can I pay with PayPal?", "There is nothing to pay."], ["Do you offer student discounts?", "Everything is free for students."]],
  fill: 90,
  fillMobile: 8,
};
