import { describe, it, expect } from "vitest";
import { EVENTS, EVENT_PREFIXES, APP, superProps } from "@/lib/analytics/taxonomy";
import { scrub } from "@/lib/analytics/posthog";
describe("analytics taxonomy", () => {
  it("uses the shared prefixes and snake_case", () => { for (const e of Object.values(EVENTS)) { expect(e, e).toMatch(/^[a-z]+(_[a-z]+)+$/); expect(EVENT_PREFIXES.some(p => e.startsWith(p)), e).toBe(true); } });
  it("never puts the product name in an event name", () => { for (const e of Object.values(EVENTS)) expect(e.includes(APP.replace(/isdead$/, ""))).toBe(false); });
  it("sends the hub's super properties", () => { expect(superProps("app")).toEqual({ product: APP, surface: "app", platform: "web" }); });
});
describe("analytics privacy", () => {
  it("strips query strings, hashes and titles", () => {
    const e = scrub({ event: "$pageview", properties: { $current_url: "https://yourappisdead.com/x/app?url=https://secret.example#frag", $referrer: "https://google.com/search?q=me", title: "My private doc" } });
    expect(e.properties.$current_url).toBe("https://yourappisdead.com/x/app"); expect(e.properties.$referrer).toBe("https://google.com/search"); expect("title" in e.properties).toBe(false);
  });
  it("cleans session-entry and any *url/*referrer/*pathname key, including $set and $set_once", () => {
    const q = "https://yourappisdead.com/otterisdead/?ref=x#y", clean = "https://yourappisdead.com/otterisdead/";
    const e = scrub({ event: "$pageview", properties: { $session_entry_url: q, $session_entry_referrer: "https://t.co/a?b=c", $session_entry_pathname: "/otterisdead/?x=1", custom_url: q, $set: { $current_url: q }, $set_once: { $initial_current_url: q } }, $set: { $initial_referrer: q }, $set_once: { $initial_pathname: "/p?x=1" } });
    expect(e.properties.$session_entry_url).toBe(clean); expect(e.properties.$session_entry_referrer).toBe("https://t.co/a"); expect(e.properties.$session_entry_pathname).toBe("/otterisdead/");
    expect(e.properties.custom_url).toBe(clean); expect(e.properties.$set.$current_url).toBe(clean); expect(e.properties.$set_once.$initial_current_url).toBe(clean);
    expect(e.$set.$initial_referrer).toBe(clean); expect(e.$set_once.$initial_pathname).toBe("/p");
  });
});
