import { NextResponse } from "next/server";

// Mints a Reactor JWT from an rk_ API key and returns it to the client.
//
// The key can come from either:
//   1. the `x-reactor-api-key` request header (entered in the UI, stored in the
//      browser) — preferred for this demo, OR
//   2. the `REACTOR_API_KEY` server env var (classic .env setup) as a fallback.
//
// We never cache here (no-store): the key is per-request now, so a cached token
// could leak across keys. The token itself is short-lived (~6h).
export const dynamic = "force-dynamic";

const TOKEN_LIFETIME_SECONDS = 6 * 60 * 60;

export async function GET(req: Request) {
  const apiKey =
    req.headers.get("x-reactor-api-key") || process.env.REACTOR_API_KEY;

  if (!apiKey) {
    // 401 (not 500) so the client knows to show the key-entry gate.
    return NextResponse.json(
      { error: "No Reactor API key — enter your rk_ key in the app." },
      { status: 401 },
    );
  }

  let res: Response;
  try {
    res = await fetch("https://api.reactor.inc/tokens", {
      method: "POST",
      headers: { "Reactor-API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ expires_after: TOKEN_LIFETIME_SECONDS }),
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Token request error: ${String(e)}` },
      { status: 502 },
    );
  }

  if (!res.ok) {
    // Surface a rejected key as 401 so the UI re-prompts; other failures as 502.
    const status = res.status === 401 || res.status === 403 ? 401 : 502;
    const msg =
      status === 401
        ? "That API key was rejected by Reactor."
        : `Reactor /tokens returned ${res.status}.`;
    return NextResponse.json({ error: msg }, { status });
  }

  const { jwt } = (await res.json()) as { jwt: string };
  return NextResponse.json({ jwt }, { headers: { "Cache-Control": "no-store" } });
}
