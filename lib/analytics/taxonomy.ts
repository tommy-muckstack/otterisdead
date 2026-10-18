// Analytics taxonomy for the shared IsDead PostHog project 666931 (contract: yourappisdead/ANALYTICS.md, see docs/ANALYTICS.md).
// Super properties: product (this app's slug), surface ("landing" = logged-out marketing pages, "app" = the working product
// and anything it publishes), platform ("web"). Page views are PostHog's built-in $pageview.
// Events are `app_<object>_<action>` (or `landing_<object>_<action>` for marketing CTAs); the product name lives in
// `product`, never in an event name. Never send user content (titles, URLs, emails, text) as properties.
export const APP = "otterisdead" as const;
export type Surface = "landing" | "app";
export const EVENTS = {
  app_signed_up: "app_signed_up",       // method ("password" | "google")
  app_signed_in: "app_signed_in",       // method ("password" | "google")
  app_signed_out: "app_signed_out",
  // ---- conversations (never titles, transcript text, notes, speaker names or file names) ----
  app_recording_started: "app_recording_started",       // demo (bool), speech_supported (bool)
  app_conversation_created: "app_conversation_created", // capture ("live" | "demo" | "import"; not "source", a legacy hub key), segments, speakers (counts), duration_s, has_audio (bool), has_notes (bool)
  app_conversation_deleted: "app_conversation_deleted", // from ("list" | "view")
  app_conversation_exported: "app_conversation_exported", // format ("md" | "txt" | "srt" | "copy")
  app_audio_attached: "app_audio_attached",
  app_speaker_renamed: "app_speaker_renamed",
  app_action_item_added: "app_action_item_added",
  app_action_item_toggled: "app_action_item_toggled",   // done (bool)
  app_question_asked: "app_question_asked",             // answers (count)
} as const;
export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
export const EVENT_PREFIXES = ["app_", "landing_"] as const;
/** Super properties every event carries (yourappisdead/ANALYTICS.md §1). */
export const superProps = (surface: Surface) => ({ product: APP, surface, platform: "web" as const });
/** Super properties older IsDead taxonomies persisted in the shared yourappisdead.com cookie. Unregistered at boot. */
export const LEGACY_PROPS = ["app", "app_family", "base_path", "suite_id", "app_id", "schema_version", "source", "site_id", "environment", "ads_blocked", "account_type"] as const;
