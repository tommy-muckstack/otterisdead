# OtterIsDead

Free, open-source Otter.ai alternative. Part of the [IsDead series](https://yourappisdead.com). Served at `https://yourappisdead.com/otterisdead`.

**Status: open source, not deployed yet**. Surfaces follow `templates/marketing-site.md` in `@isdead/design`: one marketing page (`/`, price comparison at `#pricing`), `/login`, and the app at `/app`.

## What works
- **Live recording:** continuous browser speech recognition (Chrome, Edge, Safari) with interim text, pause/resume, one-key speaker switching (1-9), typed lines, meeting notes, and optional local audio capture (MediaRecorder). A scripted demo recording runs where speech recognition is unavailable.
- **Conversations:** speaker-labelled, timestamped transcript; edit lines, rename speakers once for every line, highlight lines, search within a transcript, and global search across titles, transcripts and notes.
- **Insights:** extractive overview, keywords, time-chunked outline, action items with owner and due word (detected from phrases like "I'll …", "Priya to …", "can you …"; add, tick, remove), and a local "Ask" that returns the most relevant lines.
- **Import / export:** import pasted text, .txt, .vtt, .srt; export Markdown, text and SRT; attach an audio file (kept in IndexedDB) and click timestamps to seek.
- Core logic is pure functions in `lib/otter/model.ts` with 25 unit tests; `npm run shots` runs a Playwright smoke test of the whole flow.

## Known gaps
- Recognition quality, languages and privacy are whatever the browser vendor provides; there is no speaker diarization (you pick the speaker), and no offline Whisper model yet.
- Summaries and action items are rule-based and extractive, not an LLM; expect misses.
- Data lives in the browser (localStorage + IndexedDB, per user). No sync, sharing, calendar join or bot that joins calls.
- Otter's brand font is approximated with Outfit.

## Auth
Shared Firebase project `yourappisdead` (email/password + Google), helpers in `lib/isdead-auth` (vendored from `isdead-design/auth`). The session cookie `isdead_session` has path `/`, so one sign-in covers every IsDead app. Env: `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_SERVICE_ACCOUNT_JSON`. Without them, `/login` shows "Sign-in not configured". The single demo account ("Use the demo account") is available outside production or with `DEMO_MODE=1`.

## Develop
```
npm install
npm run dev        # http://localhost:3000/otterisdead
npm test           # unit tests
npm run typecheck
npm run build && npm run shots   # product screenshots + end-to-end smoke test (Playwright)
```
Theme and font: `vendor/isdead-design` (OFL fonts, see `fonts/*/OFL-*.txt`). Not affiliated with Otter.ai; all trademarks belong to their owners. Apache-2.0.
