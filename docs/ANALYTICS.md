# Analytics (PostHog)

One PostHog project (US cloud, project **666931**) collects the hub and every IsDead sub-app. The contract is the hub's
`yourappisdead/ANALYTICS.md`; this file is how OtterIsDead follows it.

## Setup
- `NEXT_PUBLIC_POSTHOG_KEY` = the project's publishable token (safe in the browser); `NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com`. No key → analytics is a no-op. Both are already set on the Vercel project.
- Reverse proxy through the app's own origin: `/otterisdead/ingest/*` → `us.i.posthog.com` (rewrites in `next.config.mjs`, with `skipTrailingSlashRedirect: true`).
- `<Analytics />` is mounted once in `app/layout.tsx`; it boots the client and sends PostHog's `$pageview` per route change. Autocapture and session replay are off.
- Privacy: `scrub` (the `before_send` hook in `lib/analytics/posthog.tsx`) cuts query strings and hashes from every URL property (`$current_url`, `$referrer`, `$pathname`, `$session_entry_url`/`_referrer`/`_pathname`, and any key ending in `url`, `referrer` or `pathname`, including inside `$set` / `$set_once`) and drops the page `title`. `PRIVATE_PATHS` is empty: OtterIsDead puts no conversation ids or tokens in URL paths. Heatmaps and performance capture (`$$heatmap`, `$web_vitals`) are off.
- posthog-js drops automated browsers. In dev, `localStorage.isdead_ph_debug = "1"` turns on verbose logs and lets Playwright capture; production keeps the bot filter.

## Super properties
| property | value | meaning |
| --- | --- | --- |
| `product` | `otterisdead` | filter by this |
| `surface` | `landing` \| `app` | `landing` = home, pricing, compare, login; `app` = `/app` (OtterIsDead publishes no public pages) |
| `platform` | `web` | |
| `env` | `production` \| `development` | |
| `account_type` | `firebase` \| `guest` \| `demo` | registered after the workspace loads |

## Identity
Signed-in users are identified by Firebase uid (`account_type: "firebase"`). Guest and demo sessions are never identified;
only `account_type` is registered. Sign-out sends `app_signed_out` (not for guests) and calls `reset()`, which re-registers the super properties.

## Events
Recordings, transcripts, titles, notes, speaker names, questions and file names never leave the browser. Only kinds, counts and booleans.

| event | properties |
| --- | --- |
| `app_signed_up` | `method`: password |
| `app_signed_in` | `method`: password \| google |
| `app_signed_out` | |
| `app_recording_started` | `demo`, `speech_supported` (bool) |
| `app_conversation_created` | `capture`: live \| demo \| import; `segments`, `speakers` (counts), `duration_s`, `has_audio`, `has_notes` (bool) |
| `app_conversation_deleted` | `from`: list \| view |
| `app_conversation_exported` | `format`: md \| txt \| srt \| copy |
| `app_audio_attached` | |
| `app_speaker_renamed` | |
| `app_action_item_added` | |
| `app_action_item_toggled` | `done` (bool) |
| `app_question_asked` | `answers` (count) |

Rules: event names live only in `lib/analytics/taxonomy.ts` (the unit test enforces `app_`/`landing_` prefixes and no product
name). Don't use the hub's legacy keys (`source`, `app`, `site_id`, ...) as property names; they're unregistered at boot.

## Where the calls live
`lib/analytics/` (client + taxonomy), `components/useAuth.ts` (sign-up/in with `trackNow` before the redirect),
`components/AppHeader.tsx` (sign-out), `components/otter/Workspace.tsx` (identify, create/delete),
`components/otter/MeetingView.tsx` (export, audio, speakers, action items, ask), `components/otter/Recorder.tsx` (recording started).
