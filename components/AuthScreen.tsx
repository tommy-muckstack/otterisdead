"use client";
// Otter-style centered sign in / create account card on a periwinkle gradient.
import { useState } from "react";
import Link from "next/link";
import type { FirebaseClientConfig } from "@/lib/isdead-auth/config";
import { useAuth } from "@/components/useAuth";

const GG = <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6.2a5.3 5.3 0 01-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.4z" /><path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0012 23.5z" /><path fill="#FBBC05" d="M5.6 14.2a6.9 6.9 0 010-4.4v-3H1.8a11.5 11.5 0 000 10.4z" /><path fill="#EA4335" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 001.8 6.8l3.8 3A6.9 6.9 0 0112 5.4z" /></svg>;
function OtterLogo() {
  return <svg width="38" height="16" viewBox="0 0 38 16" aria-label="Otter"><g fill="none" stroke="#0a4ef5" strokeWidth="3.6"><circle cx="8" cy="8" r="6.2" /></g><rect x="17.500" y="0.500" width="3.800" height="15" rx="1.900" fill="#0a4ef5" /><rect x="23.500" y="0.500" width="3.800" height="15" rx="1.900" fill="#0a4ef5" /><rect x="29.300" y="5" width="3.400" height="6" rx="1.700" fill="#0a4ef5" /><circle cx="35.600" cy="8" r="1.900" fill="#0a4ef5" /></svg>;
}
export function AuthScreen({ config, demo, to, signup = false }: { config: FirebaseClientConfig | null; demo: boolean; to: string; signup?: boolean }) {
  const a = useAuth({ config, demo, to, signup });
  const [more, setMore] = useState(false);
  const su = a.mode === "signup", reset = a.mode === "reset";
  return <main className="ota">
    <Link href="/" className="ota-logo" aria-label="Home"><OtterLogo /></Link>
    <div className={`ota-wrap${su ? " su" : ""}`}><section className="ota-card">
      <h1>{reset ? "Reset password" : su ? "Create account" : "Sign in"}</h1>
      {su && !reset && <p className="ota-sub">Sync your <b>work calendar</b> to start using Otter</p>}
      {reset ? <form onSubmit={a.submit(false)} className="ota-form"><input type="email" required placeholder="Email" value={a.email} onChange={e => a.setEmail(e.target.value)} /><button className="ota-pri" disabled={a.busy}>Email me a reset link</button><p className="ota-alt"><a href="#" onClick={a.go("signin")}>Back to sign in</a></p></form> : <>
        <button type="button" className="ota-prov" onClick={a.google} disabled={a.busy}>{GG}<span>Continue with Google</span></button>
        <a href="#" className="ota-why" onClick={a.off}>Why does Otter need calendar access?</a>
        <div className="ota-or"><i /><span>or</span><i /></div>
        {more ? <form onSubmit={a.submit(false)} className="ota-form">
          <input type="email" required autoComplete="email" placeholder="Email" value={a.email} onChange={e => a.setEmail(e.target.value)} />
          <input type="password" required minLength={6} autoComplete={su ? "new-password" : "current-password"} placeholder="Password" value={a.password} onChange={e => a.setPassword(e.target.value)} />
          <button className="ota-pri" disabled={a.busy}>{su ? "Create account" : "Sign in"}</button>
          {!su && <a href="#" className="ota-fgt" onClick={a.go("reset")}>Forgot password?</a>}
        </form> : <a href="#" className="ota-more" onClick={e => { e.preventDefault(); setMore(true); }}>{su ? "Sign up with email" : "Log in with email"}</a>}
        {a.err && <p role="alert" className="ota-err">{a.err}</p>}{a.note && <p role="status" className="ota-ok">{a.note}</p>}
        <p className="ota-alt">{su ? <>Already have an Otter account? <a href="#" onClick={a.go("signin")}>Sign in</a></> : <>or <a href="#" onClick={a.go("signup")}>Create account</a></>}</p>
      </>}
    </section>
    {a.demo && <button type="button" className="ota-demo" onClick={a.useDemo}>Use the demo account</button>}</div>
    <p className="ota-legal">By using Otter you agree to the <a href="#" onClick={a.off}>Terms of Service</a> and <a href="#" onClick={a.off}>Privacy Policy</a></p>
    {!a.configured && <p className="ota-cfg" role="status">Sign-in isn’t configured on this deployment yet.</p>}
  </main>;
}
