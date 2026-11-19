import { getPool } from "@/lib/server/db";
import { ok, route } from "@/lib/server/http";

export const dynamic = "force-dynamic";

/**
 * GET /api/teams/count — public counter for the registration page.
 * Supports optional `?event=` or `?eventSlug=` parameter to get count for a specific event.
 * There is no team capacity cap.
 */
export const GET = route(async (req) => {
  const pool = getPool();
  const url = new URL(req.url);
  const eventSlug = url.searchParams.get("event") || url.searchParams.get("eventSlug");

  if (!pool) return ok({ teams: 0, maxTeams: null, configured: false });

  if (eventSlug) {
    const { rows } = await pool.query(
      "SELECT COUNT(*)::int AS n FROM public.teams WHERE event_slug = $1",
      [eventSlug],
    );
    return ok({ teams: rows[0]!.n, maxTeams: null, configured: true });
  }

  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM public.teams");
  return ok({ teams: rows[0]!.n, maxTeams: null, configured: true });
});
