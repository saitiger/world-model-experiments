"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useLingbot,
  useLingbotState,
  type LingbotStateMessage,
} from "@reactor-models/lingbot";

// Pointing-finger -> dragon breathes fire.
//
// The gesture app (../../gesture-control) sends an `f` keydown while a pointing
// finger is shown and an `f` keyup when it stops. We turn that into a mid-stream
// prompt swap: append a fire clause to the scene's base prompt via setPrompt, and
// revert to the base prompt on release. Same base-prompt-capture trick as
// DynamicEvents, so it composes onto the scene the session actually started with.
//
// There's also a hold-to-fire button for testing without the gesture.

const FIRE_TEXT =
  "The dragon rears its head back and unleashes a massive, roaring torrent of " +
  "fire from its jaws — billowing orange flames, glowing embers, and shimmering " +
  "heat haze fill the air.";

export function FireBreath() {
  const { status, setPrompt } = useLingbot();
  const [snapshot, setSnapshot] = useState<LingbotStateMessage | null>(null);
  const [firing, setFiring] = useState(false);
  const basePromptRef = useRef<string | null>(null);
  const firingRef = useRef(false);

  useLingbotState((msg) => setSnapshot(msg));

  useEffect(() => {
    if (status !== "ready") {
      setSnapshot(null);
      basePromptRef.current = null;
      firingRef.current = false;
      setFiring(false);
    }
  }, [status]);

  // Capture the base prompt on first "started" snapshot; drop it on reset.
  useEffect(() => {
    if (!snapshot) return;
    if (!snapshot.started) {
      basePromptRef.current = null;
      return;
    }
    if (
      basePromptRef.current === null &&
      typeof snapshot.current_prompt === "string"
    ) {
      basePromptRef.current = snapshot.current_prompt;
    }
  }, [snapshot]);

  const ready = status === "ready" && snapshot?.started === true;

  const startFire = useCallback(() => {
    if (!ready || firingRef.current) return;
    const base = basePromptRef.current;
    if (!base) return;
    firingRef.current = true;
    setFiring(true);
    setPrompt({ prompt: `${base} ${FIRE_TEXT}` });
  }, [ready, setPrompt]);

  const stopFire = useCallback(() => {
    if (!firingRef.current) return;
    firingRef.current = false;
    setFiring(false);
    const base = basePromptRef.current;
    if (base) setPrompt({ prompt: base });
  }, [setPrompt]);

  // Listen for the `f` key (sent by the gesture app on a pointing finger).
  useEffect(() => {
    if (!ready) return;
    const isTyping = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      return (
        !!t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      );
    };
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f" && !isTyping(e)) {
        e.preventDefault();
        startFire();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        stopFire();
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [ready, startFire, stopFire]);

  if (!ready) return null;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
      <label className="text-[10px] uppercase tracking-wider text-zinc-500">
        Breath
      </label>
      <p className="mt-1 text-[11px] leading-snug text-zinc-500">
        Point your index finger (or hold the button) to make the dragon breathe fire.
      </p>
      <button
        onMouseDown={startFire}
        onMouseUp={stopFire}
        onMouseLeave={() => firing && stopFire()}
        onTouchStart={startFire}
        onTouchEnd={stopFire}
        className={`mt-2 flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
          firing
            ? "border-orange-500 bg-orange-500/20 text-orange-300"
            : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-orange-500 hover:text-orange-300"
        }`}
      >
        🔥 {firing ? "Breathing fire…" : "Breathe fire (point / hold)"}
      </button>
    </div>
  );
}
