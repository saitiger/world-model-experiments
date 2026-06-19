import { LingbotApp } from "./LingbotApp";

// The key is now entered in the UI (and stored in the browser), so the page no
// longer gates on a server env var — it always renders the client app, which
// handles the key-entry gate itself. A server-side REACTOR_API_KEY still works as
// a fallback (see app/api/reactor/token/route.ts).
export const dynamic = "force-dynamic";

export default function Page() {
  return <LingbotApp />;
}
