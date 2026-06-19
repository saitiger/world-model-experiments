"use client";

import { useState } from "react";
import { Header } from "./Header";

// Key-entry gate shown when no Reactor API key is available (no stored key and no
// server env var, or a stored key was rejected). The key is saved to localStorage
// by the caller and sent to /api/reactor/token as the `x-reactor-api-key` header.
export function ApiKeyGate({
  onSave,
  error,
}: {
  onSave: (key: string) => void;
  error?: string | null;
}) {
  const [val, setVal] = useState("");
  const valid = val.trim().startsWith("rk_");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) onSave(val.trim());
          }}
          className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900/40 p-5"
        >
          <h2 className="text-sm font-medium text-zinc-200">
            Enter your Reactor API key
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            Stored in this browser only (localStorage) and sent to the local token
            route to mint a short-lived JWT. Get one at{" "}
            <a
              href="https://www.reactor.inc/dashboard/account?section=api-keys"
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:underline"
            >
              reactor.inc/dashboard
            </a>
            . It starts with <code className="text-zinc-300">rk_</code>.
          </p>

          <input
            type="password"
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="rk_..."
            className="mt-3 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-brand focus:outline-none"
          />

          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={!valid}
            className="mt-3 w-full rounded-md bg-brand px-3 py-2 text-sm font-medium text-brand-fg hover:opacity-90 disabled:opacity-40"
          >
            Save &amp; connect
          </button>
        </form>
      </div>
    </div>
  );
}
