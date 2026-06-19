"use client";

import { useCallback, useEffect, useState } from "react";
import { LingbotProvider } from "@reactor-models/lingbot";
import { Header } from "./components/Header";
import { StatusBadge } from "./components/StatusBadge";
import { CommandError } from "./components/CommandError";
import { NowPlaying } from "./components/NowPlaying";
import { MovementControls } from "./components/MovementControls";
import { DynamicEvents } from "./components/DynamicEvents";
import { ScenePicker } from "./components/ScenePicker";
import { CustomStart } from "./components/CustomStart";
import { SnapClip } from "./components/SnapClip";
import { Video } from "./components/Video";
import { ApiKeyGate } from "./components/ApiKeyGate";
import { FireBreath } from "./components/FireBreath";

const STORAGE_KEY = "reactor_api_key";

// Fetch the JWT from our /api/reactor/token route, passing the user-entered key
// (if any) as a header. If no key is given, the route falls back to a server env
// var. A 401 means "need a (valid) key" — the caller shows the gate.
async function fetchToken(apiKey: string | null): Promise<string> {
  const r = await fetch("/api/reactor/token", {
    headers: apiKey ? { "x-reactor-api-key": apiKey } : {},
  });
  if (!r.ok) {
    const body = (await r.json().catch(() => ({}))) as { error?: string };
    const err = new Error(body.error ?? `Token fetch failed: ${r.status}`);
    (err as Error & { status?: number }).status = r.status;
    throw err;
  }
  const { jwt } = (await r.json()) as { jwt: string };
  return jwt;
}

// The client tree. LingbotProvider owns the WebRTC connection lifecycle —
// it auto-disconnects on unmount and on `beforeunload`, so don't call
// connect()/disconnect() from a useEffect yourself.
//
// We deliberately do NOT pass `autoConnect: true` here. The user clicks
// "Connect" so they see the disconnected → connecting → waiting → ready
// state machine first-hand. Flip it on in your own product if you'd
// rather skip straight to "ready".
export function LingbotApp() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needKey, setNeedKey] = useState(false);
  const [loading, setLoading] = useState(true);

  const tryToken = useCallback(async (key: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const jwt = await fetchToken(key);
      setToken(jwt);
      setNeedKey(false);
    } catch (e) {
      const status = (e as Error & { status?: number }).status;
      if (status === 401) {
        setToken(null);
        setNeedKey(true);
        setError(key ? "That API key was rejected. Check it and try again." : null);
      } else {
        setError(String((e as Error).message ?? e));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: load any saved key and try to mint a token (falls back to a server
  // env key if there's no saved one).
  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    setApiKey(stored);
    tryToken(stored);
  }, [tryToken]);

  const saveKey = useCallback(
    (key: string) => {
      localStorage.setItem(STORAGE_KEY, key);
      setApiKey(key);
      tryToken(key);
    },
    [tryToken],
  );

  const changeKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey(null);
    setToken(null);
    setError(null);
    setNeedKey(true);
  }, []);

  if (needKey) {
    return <ApiKeyGate onSave={saveKey} error={error} />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <p className="text-sm text-red-400">Couldn&apos;t start: {error}</p>
          <button
            onClick={() => tryToken(apiKey)}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:border-brand hover:text-brand"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !token) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
          Loading session…
        </div>
      </div>
    );
  }

  return (
    <LingbotProvider jwtToken={token}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:gap-6 lg:p-6">
          {/*
           * The sidebar has two phases driven by `snapshot.started`:
           *
           *   - Setup  (waiting):    <ScenePicker />     + <CustomStart />
           *   - Live   (generating): <NowPlaying />      + <MovementControls />
           *                                              + <DynamicEvents />
           *
           * Each component subscribes to the snapshot via
           * `useLingbotState` and returns null when it's not its phase.
           * On disconnect, each component also clears its snapshot via
           * a small useEffect — keeps the UI from showing stale data
           * from the previous session after a reconnect.
           *
           * <DynamicEvents /> is the live-phase prompt-swap surface —
           * one click appends a curated world-event sentence ("rain
           * begins", "fog rolls in") to the active prompt and re-sends
           * via `set_prompt`. The model picks it up on the next chunk.
           *
           * <SnapClip /> is model-agnostic — it only needs the base SDK
           * to capture the last N seconds of the live stream — so it
           * sits at the bottom of the sidebar and is visible whenever
           * the connection is `"ready"`.
           */}
          <aside className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
            <StatusBadge />
            <CommandError />
            <NowPlaying />
            <MovementControls />
            <FireBreath />
            <DynamicEvents />
            <ScenePicker />
            <CustomStart />
            <SnapClip />
            <button
              onClick={changeKey}
              className="mt-1 self-start text-[10px] text-zinc-600 hover:text-zinc-400"
            >
              change API key
            </button>
          </aside>
          <section className="flex-1">
            <Video />
          </section>
        </main>
      </div>
    </LingbotProvider>
  );
}
