---
name: longlive-v2-prompts
description: Write effective prompts and storyboards for Reactor's LongLive 2 model, a multi-shot, text-to-video generation model you direct like a storyboard. Use when creating LongLive prompts, multi-shot sequences, shots, cuts, or when the user mentions LongLive, a storyboard, or a long/multi-scene video. Covers the five-paragraph shot caption, the shot-vs-cut grammar, the per-scene 48-chunk budget, continuity across shots, and scheduling beats on the chunk timeline.
---

# LongLive 2 Prompt Writing

LongLive 2 is a **multi-shot, text-to-video** model you direct like a storyboard. There is **no reference-image input** — every scene is described in prose. You open with a **shot**, then transition with soft **shots** (same world, continuity preserved) or hard **cuts** (new scene, memory purged). Output is a single continuous `main_video` track.

A prompt here is a **per-shot caption**: a ~300-token, five-paragraph description in present tense.

## The shot-vs-cut grammar (internalize this first)

|              | **shot** (`set_shot`)               | **cut** (`scene_cut`)         |
| ------------ | ----------------------------------- | ----------------------------- |
| Feel         | new beat, same world                | clean break to a new scene    |
| Memory       | preserved                           | purged                        |
| Chunk budget | **spends** the current scene budget | **resets** it (fresh 48)      |
| Length       | does not extend                     | **extends** the video         |

Use a **shot** for a new beat in the same world (subject does something new, framing shifts, light changes). Use a **cut** for a true scene change. Using a shot for a real scene change bleeds the old world in; using a cut for a small framing change throws away continuity.

## Chunks, scenes, and length

- A **chunk** is 29 frames (~1.2 s at 24 fps).
- Two counters arrive on every `chunk_complete` / `state`: `current_chunk` (per scene, resets on cut) and `session_chunk` (cumulative, never resets).
- **A scene auto-completes at 48 chunks (~58 s).** To go longer, `scene_cut` to a new scene — that resets the per-scene budget.
- **Scheduling fires against `session_chunk`.** A beat scheduled past where its scene auto-completes **never fires** — always place an earlier cut, or keep the beat inside the 48-chunk window.

## The five-paragraph caption

Each shot caption is ~300 tokens of complete English sentences in **present tense**, paragraphs separated by blank lines. **No bullet points, no Markdown, no headings** inside the caption.

```
[Paragraph 1 — STYLE]      Visual style, color palette, lighting, overall atmosphere.
[Paragraph 2 — SCENE]      Environment, location, time of day, weather, background.
[Paragraph 3 — CHARACTERS] Identity, clothing, expression, posture. Singular subjects.
[Paragraph 4 — OBJECTS]    Key objects, their materials, and spatial positioning.
[Paragraph 5 — ACTION]     Motion, interactions, and camera movement for this shot.
```

Write each paragraph as flowing prose. Paragraph 5 is the only one that changes meaningfully between shots in the same scene — that's where the new beat lives.

## Continuity across shots (the #1 quality lever)

The model has no image anchor, so **prose is the only continuity mechanism**. Within a scene:

- **Repeat object attributes verbatim across shots** — color, shape, material. "A brushed-steel thermos with a cracked red cap" stays exactly that in every shot, or it will morph.
- **Keep subjects and locations singular and simple.** One protagonist, one place per scene. Complex multi-subject scenes drift fast.
- **Restate identity and setting in paragraphs 1–4**, change only paragraph 5's action. This mirrors the Helios continuity rule: stability in the unchanging description is what produces smooth on-screen continuity.
- After a **cut**, you may reintroduce everything fresh — memory is purged, so there's nothing to stay consistent with.

## Worked example (one scene, two shots)

**Shot 0 (opener):**

```
The footage has a warm, filmic look with soft golden lighting, gentle film grain,
and a muted earth-toned palette that feels nostalgic and calm.

A small wooden cabin kitchen at dawn, low light coming through a single frosted
window, frost still on the glass, the room quiet and still.

An older woman with silver hair tied back, wearing a thick charcoal wool cardigan
over a cream blouse, stands relaxed with a faint, content expression.

A brushed-steel thermos with a cracked red cap sits on the worn pine table beside
a chipped white ceramic mug, both centered in the lower frame.

She slowly pours steaming coffee from the thermos into the mug, steam curling up
into the cold air, the camera holding a steady medium shot on her hands and the table.
```

**Shot 1 (`set_shot` — same scene, new beat):** paragraphs 1–4 stay nearly identical (same look, same kitchen, same woman, **same brushed-steel thermos with the cracked red cap**); only paragraph 5 changes:

```
She lifts the mug with both hands and takes a slow sip, her eyes closing briefly,
shoulders settling, steam still rising as the camera pushes in gently to a closer
framing on her face.
```

To continue past ~58 s or move somewhere new, issue a **`scene_cut`** with a fully fresh five-paragraph caption.

## Directing on the timeline

- The **opener** is `set_shot` + `start`. Everything authored after the opener is **scheduled** (`schedule_shot` / `schedule_scene_cut`) at an absolute `session_chunk`, then `start` runs them.
- Live "now" beats are `set_shot` / `scene_cut` (apply at the next boundary). Scheduled beats are the `schedule_*` variants.
- **There is no `unschedule`.** You can't move or cancel a scheduled beat once it's on the model — only `reset` clears everything. Compose before `start`, or fire live.
- **Optimal complexity: keep it simple.** Use shorter durations for visually complex shots, longer ones for calm exploration.

## Critical rules

**DO:**
- Write five-paragraph captions, ~300 tokens, present tense, prose only.
- Put style/scene/characters/objects in paragraphs 1–4 and the *new* action in paragraph 5.
- Repeat object attributes (color, shape, material) verbatim across shots in a scene.
- Keep subjects and locations singular and simple.
- Use a **cut** to extend length or change scene; use a **shot** for a new beat in the same world.
- Schedule beats inside the 48-chunk-per-scene budget (or place an earlier cut).

**DON'T:**
- Use bullet points, Markdown, or headings inside a caption.
- Write single-line prompts — the model needs the full paragraph structure.
- Use a `set_shot` for a true scene change (the old world bleeds in).
- Use a `scene_cut` for a small framing change (you throw away continuity).
- Schedule a beat past a scene's 48-chunk ceiling with no earlier cut — it never fires.
- Let object attributes drift between shots in the same scene.
- Redundantly describe a completed action unless you intend it to continue.

## Checklist

Before finalizing any LongLive 2 shot or storyboard:

- [ ] Every caption has all five paragraphs (style · scene · characters · objects · action)
- [ ] ~300 tokens, present tense, prose only — no bullets/Markdown/headings
- [ ] Subjects and locations are singular and simple
- [ ] Object attributes repeated verbatim across shots in the same scene
- [ ] Paragraphs 1–4 stable within a scene; only paragraph 5's action changes per shot
- [ ] Shot vs cut chosen correctly (same world → shot; new scene / extend length → cut)
- [ ] Every scheduled beat lands inside its scene's 48-chunk budget (or an earlier cut resets it)
- [ ] Opener is `set_shot` + `start`; later authored beats are `schedule_*`
- [ ] Total sequence accounts for ~58 s auto-complete per scene
