"use client";
import Link from "next/link";
import { BP } from "@/lib/basepath";
import { trackNow, resetIdentity, EVENTS } from "@/lib/analytics";
export function AppHeader({ user, children }: { user: { name: string; email: string; demo: boolean; guest?: boolean }; children?: React.ReactNode }) {
  return <header className="app-hd"><Link href="/app" className="app-hd__logo" style={{ color: "inherit", textDecoration: "none" }}><svg width="56" height="24" viewBox="0 0 38 16" aria-label="Otter" role="img"><circle cx="8" cy="8" r="6.2" fill="none" stroke="#0a4ef5" strokeWidth="3.6" /><rect x="17.5" y="0.5" width="3.8" height="15" rx="1.9" fill="#0a4ef5" /><rect x="23.5" y="0.5" width="3.8" height="15" rx="1.9" fill="#0a4ef5" /><rect x="29.3" y="5" width="3.4" height="6" rx="1.7" fill="#0a4ef5" /><circle cx="35.6" cy="8" r="1.9" fill="#0a4ef5" /></svg></Link>
    <div className="app-hd__mid">{children}</div>
    <div className="app-hd__user"><span className="ids-muted" style={{ fontSize: 13 }}>{user.guest ? "Guest · sign in to keep your work" : user.demo ? "Demo account" : user.email}</span>
      <form method="post" action={`${BP}/api/session/logout`} onSubmit={async e => { e.preventDefault(); const f = e.currentTarget; if (!user.guest) await trackNow(EVENTS.app_signed_out); resetIdentity(); f.submit(); }}><button className="ids-btn ids-btn--ghost ids-btn--sm">Sign out</button></form></div></header>;
}
