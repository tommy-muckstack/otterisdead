import { buildMeeting, parseTranscript, type Meeting } from "./model";

const DAY = 86_400_000;
const SYNC = `[0:00] Maya: Okay, let's get started. Main goal today is to lock the launch plan for the booking page and decide what ships in the first release.
[0:14] Jonas: I finished the pricing comparison and the calendar sync. The sync handles Google and Outlook now, and the remaining bug is time zones near daylight saving changes.
[0:41] Maya: Good. Time zones are the scariest part of the launch, so I'd like a full test pass before we announce anything.
[0:55] Priya: I'll write the time zone test cases and run them against twenty real calendars by Thursday. I also need to update the onboarding emails.
[1:20] Jonas: The onboarding emails should mention that the product is free, since pricing is the main reason people switch to us.
[1:38] Maya: Agreed. Priya to draft the onboarding emails and send them to me for review by Friday.
[2:02] Sam: Support is ready. We have a help center article for connecting calendars, and I'll record a short walkthrough video tomorrow.
[2:25] Maya: Can you also add a section on cancelling and rescheduling to the help center? Customers ask about that first.
[2:41] Sam: Yes, I'll add the cancelling and rescheduling section before launch.
[3:05] Jonas: One risk is the launch day traffic. We should load test the booking API, because the calendar sync gets hammered when many people connect at once.
[3:30] Maya: Let's do that on Monday. Jonas will run the load test and share the results in the channel.
[3:52] Maya: Final decision: launch next Wednesday if the time zone tests pass and the load test is clean. Otherwise we slip by a week.`;

const INTERVIEW = `[0:00] Alex: Thanks for making time, Dana. I'd love to hear how your team handles scheduling today.
[0:12] Dana: Honestly it's a mess. We use a shared spreadsheet and a lot of email. Clients ask for a time, we reply with three options, and it takes four or five messages to settle on one.
[0:40] Alex: How many meetings a week are we talking about?
[0:46] Dana: Around sixty. Two people on my team spend about a third of their week just coordinating calendars.
[1:10] Alex: What have you tried so far?
[1:14] Dana: We tried a big enterprise tool, but the price per seat was too high for us. Everyone needs an account, and half the team only books a few meetings a month.
[1:48] Dana: What I really want is a simple booking page, calendar sync, and reminders so clients stop missing calls. I don't need fancy analytics.
[2:20] Alex: That's really helpful. Would a free, open source option change the decision for you?
[2:28] Dana: Definitely. If it's free and I can host it myself, I can get approval in a day. I'd want to export all our data in case we ever leave.
[2:58] Alex: I'll send you the demo link this afternoon and follow up next week to see how the trial went.`;

const BOARD = `Priya: Welcome everyone. Today I'll walk through the quarter and then we'll take questions.
Priya: Revenue grew eighteen percent, driven mostly by the self hosted plan. Churn fell to two percent, the lowest we have seen.
Chris: The main risk for next quarter is hiring. We need to hire two engineers and one designer, and the market is slow.
Priya: We should open the roles this week and ask the board for referrals.
Lena: I'll introduce three engineering candidates from my network by the end of next week.
Chris: And we need to finalize the budget for the offsite before the next board meeting.
Priya: Thank you all. Let's follow up on hiring in two weeks.`;

export function seedMeetings(now = Date.now()): Meeting[] {
  const mk = (title: string, raw: string, ago: number, notes = "") => { const p = parseTranscript(raw); const m = buildMeeting(title, p.segments, "demo", notes, now - ago); return m; };
  const a = mk("Weekly product sync", SYNC, 0.1 * DAY, "Launch checklist:\n- time zone tests\n- onboarding emails\n- load test Monday");
  const b = mk("Customer interview: Dana at Fieldly", INTERVIEW, 2 * DAY, "Pain: 4-5 emails per booking. Wants free + self-hosted + export.");
  const c = mk("Board prep: Q3 review", BOARD, 6 * DAY);
  a.segments[3].hl = true; a.segments[11].hl = true; b.segments[6].hl = true;
  return [a, b, c];
}

/** Lines streamed by the "Run a demo recording" button (and used in tests / where speech recognition is unavailable). */
export const DEMO_LINES: { speaker: string; text: string }[] = [
  { speaker: "Maya", text: "okay let's start the design review for the new onboarding flow" },
  { speaker: "Maya", text: "the goal is to cut the setup time from ten minutes to two" },
  { speaker: "Ravi", text: "I measured the current flow and most people drop off at the calendar connection step" },
  { speaker: "Ravi", text: "I'll prototype a version that connects the calendar in one click by Friday" },
  { speaker: "Maya", text: "great and please share the prototype with the support team so they can give feedback" },
  { speaker: "Ana", text: "we should also test the new copy with five customers next week" },
];
