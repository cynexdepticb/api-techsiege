/**
 * Canonical tracks. The single source of truth for anything that needs to
 * validate or label a track — the registration form, the API route, and the
 * organizer dashboard all read from here.
 *
 * `lib/content.ts` composes these into the richer cards the site renders (it
 * adds `desc` and `examples`), so a track can never exist in the UI without
 * being accepted by the API, or vice versa.
 */
export const TRACKS = [
  { id: "agentic-ai", title: "Agentic AI & Automation" },
  { id: "cybersecurity", title: "Cybersecurity & Digital Trust" },
  { id: "climate-energy", title: "Climate & Energy Intelligence" },
  { id: "digital-health", title: "Digital Health & Accessibility" },
  { id: "civic-tech", title: "Civic & Public Infrastructure" },
] as const;

export const TRACK_IDS = TRACKS.map((t) => t.id) as [TrackId, ...TrackId[]];

export type TrackId = (typeof TRACKS)[number]["id"];

/** Track id → display label, for API responses that need a human-readable name. */
export const TRACK_LABELS: Record<TrackId, string> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t.title]),
) as Record<TrackId, string>;

/** Hard cap on total teams for the event. */
export const MAX_TEAMS = 60;
