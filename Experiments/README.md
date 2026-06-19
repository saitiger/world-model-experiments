# Reactor Experiments

Runnable starting points for building on Reactor's video models. Clone a folder, fill in the marked placeholders, and build on top. Each template pairs with a prompting [cookbook](../docs/cookbook/) and an agent [skill](../skills/).

| Template | Model | Stack | What it does | Cookbook · Skill |
| --- | --- | --- | --- | --- |
| [`reactor-dragon/`](reactor-dragon) | **LingBot** | Next.js 15 + TypeScript | Pick a starting image, watch it come alive, drive the world with WASD + look, fire dynamic events | [cookbook](../docs/cookbook/lingbot.md) · [skill](../skills/lingbot-prompts/SKILL.md) |
| [`helios-snap/`](helios-snap) | **Helios** | React + Vite (JSX) | Photo → Ghibli still (Gemini) → Helios animates it → record the clip | [cookbook](../docs/cookbook/helios.md) · [skill](../skills/helios-prompts/SKILL.md) |

> LongLive 2 and SANA-Streaming have a cookbook + skill but no standalone app template yet — drop in a repo for either and add a row here.

---

## reactor-dragon (LingBot)

A first-person navigable world. Five curated image+prompt scenes, WASD/look driving, curated weather/world events, fire-breath, and snap-clip recording.

**Run it**
```bash
cd reactor-dragon
cp .env.example .env
# add your key: REACTOR_API_KEY=rk_...   (get one at reactor.inc/account/api-keys)
pnpm install
pnpm dev          # http://localhost:3000
```

**Fill in here (make it yours)**
- `.env` → `REACTOR_API_KEY` — your Reactor key.
- `app/lib/scenes.ts` → the `SCENES` array — swap in your own seed images + paragraph prompts. **Each prompt must follow the LingBot rules** (paragraph length, explicit rear-view camera framing, no camera-motion verbs). See the [LingBot cookbook](../docs/cookbook/lingbot.md).
- `public/images/` → drop your seed images here and point `imageUrl` at them.
- `app/lib/dynamic-events.ts` → the curated world events (rain/fog/night…). One sentence each, atmosphere-only — see the cookbook's hold-prompt/event guidance.

**Before you write a prompt:** read [`skills/lingbot-prompts/SKILL.md`](../skills/lingbot-prompts/SKILL.md). The model's signature failure is camera-motion verbs in the prompt fighting the WASD controls.

---

## helios-snap (Helios)

A photo-to-animation pipeline: upload or capture a photo → Gemini renders a Studio-Ghibli still → Helios animates that still into a continuous stream → record and save the clip.

**Run it**
```bash
cd helios-snap
cp .env.local.example .env.local
# add: VITE_REACTOR_API_KEY=rk_...  and  VITE_GEMINI_API_KEY=...
npm install
npm run dev       # http://localhost:5173
```

**Fill in here (make it yours)**
- `.env.local` → `VITE_REACTOR_API_KEY` (Reactor) and `VITE_GEMINI_API_KEY` (Google AI Studio).
- `src/App.jsx` → `ANIMATE_PROMPT` (line ~10) — the Helios prompt that drives the animation. **A one-liner like `"animate it"` works but is the weakest case** — for smoother, intentional motion, write a full Helios start prompt (subject · environment · lighting · camera). See the [Helios cookbook](../docs/cookbook/helios.md).
- `src/App.jsx` → the Gemini transform `prompt` (~line 402) — change the art style ("Studio Ghibli" → your look).
- `src/App.jsx` → `GEMINI_MODEL` (line ~11) — the image model id.

**Before you write a prompt:** read [`skills/helios-prompts/SKILL.md`](../skills/helios-prompts/SKILL.md). Helios rewards a *sequence* of prompts (start + one-change follow-ups) far more than a single line — the cookbook shows the pattern.

---

## Notes

- These were vendored from standalone repos; their original READMEs (and `reactor-dragon/skill/SKILL.md`) are kept in each folder.
- Lockfiles are included as cloned. Delete and reinstall if you change the dependency set.
- Keep API keys server-side in production. `reactor-dragon` already brokers a short-lived JWT via `app/api/reactor/token/route.ts`; `helios-snap` ships an `api/token.js` serverless route for the same purpose (the dev path can use the client key directly — see its README).
