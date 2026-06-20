---
title: product-snap experiment
date: 2026-06-20
status: ready-to-plan
---

# product-snap — Product Showcase Video Generator

## What it is

A runnable experiment in `Experiments/product-snap/` that turns a product photo into a short cinematic showcase clip. The user uploads a product image, writes a style description and an animation direction, and gets back a loopable video they can download.

Forked from `Experiments/helios-snap/` — same React + Vite + Gemini + Helios pipeline, different prompt layer and UX framing.

## Problem it solves

helios-snap hard-codes the Ghibli art style and a fixed Helios animation prompt. Developers who want to use the pipeline for real product work have to dig into the source to change them. product-snap surfaces both prompts as editable fields with product-appropriate defaults, making it immediately useful and easy to fork.

## User flow

1. **Upload** a product photo (drag-and-drop or file picker)
2. **Write a style** — a text field pre-filled with a product-appropriate default (e.g. `"Clean editorial product photography, luxury aesthetic, high contrast"`)
3. **Write an animation direction** — a second field pre-filled with a Helios-appropriate motion prompt (e.g. `"Slow cinematic pullback, dramatic studio lighting sweeping across the product, shallow depth of field, medium shot"`)
4. **Generate** — Gemini transforms the photo using the style prompt; Helios animates the result using the animation prompt
5. **Preview** the live Helios stream
6. **Record** a clip and **download** it as `.webm`

## What's different from helios-snap

| | helios-snap | product-snap |
| --- | --- | --- |
| Style transform | Hard-coded "Studio Ghibli" | Editable text field, product default |
| Animation prompt | Hard-coded constant | Editable text field, motion default |
| UX framing | "Animate a photo" | "Create a product showcase" |
| Output | Record (no download) | Record + download button |
| Examples | None | 3 example prompts users can load |

## Key UX details

- **Editable prompts are always visible** — not hidden in settings. Users see exactly what's being sent to each model. This is also the learning mechanism: they edit, they see what changes.
- **3 example prompt pairs** (load with one click): e.g. "Luxury fashion / slow pullback", "Athletic gear / dynamic motion blur", "Minimal tech / floating in space". These populate both fields without locking them — the user can still edit after loading.
- **Download button** appears after recording completes. This is the primary output; it's what makes it useful for actual brand/product work.
- **Gemini model stays configurable** via `.env.local` (`VITE_GEMINI_MODEL`) same as helios-snap.

## Out of scope

- Automatic product category detection
- Multi-shot LongLive sequences (separate experiment)
- Background removal / compositing
- Audio / music sync

## Success criteria

- Developer can clone, add two API keys, `npm run dev`, and see a product clip in under 10 minutes
- Both prompt fields are visible and editable before generation
- Download produces a valid `.webm` file
- The three example pairs demonstrate meaningfully different aesthetics

## Customization points (for forkers)

- Both prompt fields (and their defaults) live in clear constants at the top of `App.jsx`
- `.env.local` → `VITE_REACTOR_API_KEY`, `VITE_GEMINI_API_KEY`, `VITE_GEMINI_MODEL`
- Example pairs in a single `EXAMPLES` array — swap in your own
- Helios animation prompt follows the Helios SKILL.md start-prompt structure (SUBJECT · ENVIRONMENT · LIGHTING · CAMERA)

## Relation to existing files

- Forks `Experiments/helios-snap/` as base
- Pairs with `skills/helios-prompts/SKILL.md` and `docs/cookbook/helios.md`
- `Experiments/README.md` gets a new row once built
- `AGENTS.md` Step 3 already routes Helios users to `experiments/helios-snap/` — update to mention product-snap as an alternative once built
