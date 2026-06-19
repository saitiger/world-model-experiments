# LongLive 2 Cookbook

A prompting cookbook for **LongLive 2**, text-to-video model you direct like a storyboard. This goes deeper than the [SKILL.md](../../skills/longlive-v2-prompts/SKILL.md) with worked storyboards, named recipes, and a mistake gallery. It covers **prompting only** — for SDK, auth, scheduling APIs, and frontend wiring, see the LongLive SKILL and the reactor-team examples.

---

## What LongLive 2 is, plainly

There is **no reference image** — every scene is described in prose. You direct like a storyboard: an **opening shot**, then **shots** (soft transitions that keep the world and its memory) and **cuts** (hard breaks to a brand-new scene). The video is one continuous stream; you steer it by firing or scheduling beats on a chunk timeline.

The two craft skills are: (1) write a dense, five-paragraph caption per shot, and (2) choose **shot vs cut** correctly so continuity and length behave.

---

## Shot vs cut — the decision that governs everything

| | **shot** (`set_shot`) | **cut** (`scene_cut`) |
| --- | --- | --- |
| Feel | new beat, same world | clean break, new scene |
| Memory | preserved | purged |
| Budget | **spends** the scene's 48 chunks | **resets** to a fresh 48 |
| Length | does not extend | **extends** the video |

A **chunk** is 29 frames (~1.2 s @ 24 fps). A scene **auto-completes at 48 chunks (~58 s)**. To run longer, cut. Scheduling fires against the cumulative `session_chunk`; **a beat scheduled past its scene's auto-complete never fires** — place an earlier cut.

> Decision rule: *Same place, same people, next moment?* → **shot.** *New place or new time, fine to forget what came before?* → **cut.*

---

## The five-paragraph caption template

~300 tokens, present tense, complete sentences, blank line between paragraphs. **No bullets, no Markdown, no headings inside the caption.**

```
P1 STYLE       Visual style, color palette, lighting, atmosphere.
P2 SCENE       Environment, location, time of day, weather, background.
P3 CHARACTERS  Identity, clothing, expression, posture. Singular subjects.
P4 OBJECTS     Key objects, their materials, spatial positioning.
P5 ACTION      Motion, interactions, camera movement for THIS shot.
```

Paragraphs 1–4 are the **continuity bed** — keep them near-identical across shots within a scene. Paragraph 5 carries the **new beat**.

---

## Worked storyboard — "The morning pour" (one scene, three shots)

**Shot 0 — opener (`set_shot` + `start`):**
```
The footage has a warm, filmic look with soft golden lighting, gentle film grain,
and a muted earth-toned palette that feels nostalgic and calm.

A small wooden cabin kitchen at dawn, low light through a single frosted window,
frost still on the glass, the room quiet and still.

An older woman with silver hair tied back wears a thick charcoal wool cardigan
over a cream blouse, standing relaxed with a faint, content expression.

A brushed-steel thermos with a cracked red cap sits on the worn pine table beside
a chipped white ceramic mug, both centered in the lower frame.

She slowly pours steaming coffee from the thermos into the mug, steam curling into
the cold air, the camera holding a steady medium shot on her hands and the table.
```

**Shot 1 — `set_shot` (same world, P1–P4 unchanged, only P5 new):**
```
She lifts the mug with both hands and takes a slow sip, eyes closing briefly,
shoulders settling, steam still rising as the camera pushes in gently to a closer
framing on her face.
```

**Shot 2 — `set_shot`:**
```
She lowers the mug back beside the brushed-steel thermos with the cracked red cap
and turns toward the frosted window, a faint smile forming as morning light
strengthens across her face, the camera easing back to the medium shot.
```

Then to move somewhere new (or pass ~58 s), issue a **`scene_cut`** with a fully fresh five-paragraph caption.

The load-bearing detail: *the brushed-steel thermos with the cracked red cap* is repeated **verbatim** in every shot it appears in. Drop the attributes and it morphs into a different object between shots.

---

## Recipe: extend a video past one minute

A single scene caps at ~58 s. To make a 3-minute piece, plan **cuts** as your scene boundaries and shots as beats inside each scene:

```
Scene A (cut/opener) → shot → shot           ~50s   "morning kitchen"
Scene B (scene_cut)  → shot → shot           ~50s   "walking the frosted lane"
Scene C (scene_cut)  → shot                  ~40s   "arriving at the lit shopfront"
```

Each `scene_cut` resets the 48-chunk budget, so schedule each scene's internal shots well inside its own window.

## Recipe: a clean multi-shot continuity bed

Author paragraphs 1–4 **once** as a block, then write only paragraph 5 per shot. Concretely:

1. Lock P1 (style) and P2 (scene) for the whole scene — never vary them within a shot.
2. Lock P3 (character) and P4 (objects), repeating every object's color/shape/material verbatim.
3. Write a P5 per beat. Each P5 is one continuous action plus its camera move.

This mirrors the Helios "reestablish + one new action" rule, scaled up to paragraphs.

---

## Common mistakes

| Mistake | Why it hurts | Fix |
| --- | --- | --- |
| `set_shot` used for a real scene change | The old world bleeds into the new one | Use `scene_cut` — it purges memory |
| `scene_cut` used for a small framing change | Throws away all continuity needlessly | Use `set_shot` — it preserves the world |
| Beat scheduled past the 48-chunk ceiling | It silently never fires | Place an earlier `scene_cut`, or move the beat earlier |
| Object attributes drift between shots | The object visibly morphs | Repeat color/shape/material verbatim every shot |
| Bullets / Markdown inside a caption | Degrades the caption; model expects prose | Flowing present-tense sentences only |
| Single-line prompt | Under-specified; output is unstable | Full five-paragraph structure, ~300 tokens |
| Many subjects / locations in one scene | Drifts fast, hard to keep coherent | Keep subjects and locations singular and simple |
| Redundantly re-describing a finished action | Model may loop or stall the motion | Only describe an action if it should continue |

---

## Validation checklist

- [ ] Every caption has all five paragraphs (style · scene · characters · objects · action)
- [ ] ~300 tokens, present tense, prose only — no bullets/Markdown/headings
- [ ] Subjects and locations are singular and simple
- [ ] Object attributes repeated verbatim across shots in the same scene
- [ ] P1–P4 stable within a scene; only P5 changes per shot
- [ ] Shot vs cut chosen correctly (same world → shot; new scene / longer → cut)
- [ ] Every scheduled beat lands inside its scene's 48-chunk budget
- [ ] Opener is `set_shot` + `start`; later authored beats are `schedule_*`
- [ ] Total runtime accounts for ~58 s auto-complete per scene
