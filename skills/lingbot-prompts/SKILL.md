---
name: lingbot-prompts
description: Write effective prompts for Reactor's LingBot model, a real-time, navigable world video model (WASD movement + look controls + live prompt steering). Use when creating LingBot prompts, world/scene prompts, hold-prompts, or when the user mentions LingBot, a navigable world, or a "drive through it" video. Covers base-prompt structure, traversal vs spectator mode, the seven anchor planes, hold-prompts for live events, and the rules that wreck output (camera verbs, multiple destinations, mood stacking).
---

# LingBot Prompt Writing

LingBot is a **real-time, navigable world model**. It takes three simultaneous inputs — a **seed image** (fixes the visual identity of the world), **control signals** (`set_movement` / `set_look_*`, driven by WASD + arrow keys), and a **text prompt**. The text's only job is to describe *what the world is and how it feels*. It does **not** drive the camera — the controls do.

A prompt is a 2–4 sentence paragraph that anchors every spatial plane of the scene. Output is portrait 480×832 by default.

## The single most important rule

**Never describe camera operations in the prompt.** No *pan*, *tilt*, *dolly*, *track*, *push in*, *pull back*, *orbit*, *zoom*, or *fly through*. Camera motion is driven entirely by the control signals; putting it in the text makes the model generate phantom camera motion that fights what the user's controls are asking for.

Positional language is fine (*"rear view," "subject centered in frame," "low-angle shot"*). Imperative motion verbs are not.

| ❌ Wrong                                          | ✅ Right                                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| "The camera pans across a snowy mountainside."   | "A snowy mountainside, low cloud breaking over the ridgeline at our level."          |
| "Tracking shot following a knight down a hall."  | "A torch-lit stone corridor with a knight ahead, banners stirring in the draft."     |
| "Pull back to reveal a desert city at sunset."   | "A walled desert city under late-amber light, dust thermals climbing the curtain wall." |

## Three-way alignment rule

All three simultaneous inputs must agree with each other. Conflict between any pair degrades output:

| Pair | Rule |
| ---- | ---- |
| **Text ↔ Image** | The prompt must match what the seed image actually shows. If the image shows a desert canyon, the prompt must describe a desert canyon — not a snowy forest. |
| **Text ↔ Action** | Motion in the prompt must align with the current `set_movement` / `set_look_*` commands. A prompt saying "the vehicle rolls forward" while `movement = "idle"` creates a split the model can't resolve. |
| **Text ↔ Text** | No two layers within the same assembled prompt should contradict each other. Base says "overcast sky" → event can't say "the sun breaks through." Rewrite the conflicting fragment entirely. |

Before firing any prompt, run: *does the text match the image? does the text match the controls? are there internal conflicts?*

## Subject-entity constraint

**Subjects in the base prompt must not be given their own autonomous motion.** The viewer's WASD controls imply forward motion; adding a moving entity competes.

| ❌ Wrong | ✅ Right |
| -------- | -------- |
| "A dog walking down a country lane" | "A border collie in tall summer grass, a country lane running through the field" |
| "A horse galloping across the plains" | "A bay horse on open plains, mountains on the far horizon" |

The subject can exist in the scene — it just can't be independently moving toward a destination.

## Traversal mode vs. spectator mode

Pick by asking: *is the viewer the entity in the scene, or watching the entity?*

- **Traversal** — the viewer is inside the world, moving through it (driving a character/vehicle with WASD). Most LingBot scenes are traversal. If the seed image is first-person or low-angle approaching something, it's traversal.
- **Spectator** — the viewer watches from a fixed point; the scene has ambient dynamics but no destination. If the seed shows a subject against a backdrop from outside, it's spectator.

When ambiguous, **default to traversal** — it produces richer dynamics.

**Openers matter (the model is trained on them):**
- Traversal prompts start with **"The video presents…"**
- Spectator prompts start **directly with the scene anchor** (no "The video presents").

## Base-prompt structure

Every base prompt follows the same shape:

```
{{world}}. {{sensation}}. {{event}}[, {{motion_resolution}}]. {{mood}}.
```

| Slot                  | What it is                                                          | Rule                                                                          |
| --------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `{{world}}`           | Where we are, and (if moving) how: domain + journey type           | Traversal: "a soaring journey through a fantasy jungle". Spectator: "a serene lakeside at dusk" |
| `{{sensation}}`       | One physical detail grounding the dynamics — **most-skipped slot**  | Moving: body/material sensation. Spectator: texture or ambient behavior        |
| `{{event}}`           | The one thing that moves, resolves, or reveals                     | Traversal: destination + approach verb. Spectator: one ambient dynamic. **One only.** |
| `{{motion_resolution}}` | **Traversal only.** Texture sharpening against a backdrop as you approach | "its [detail] becoming clearer against [backdrop]"                       |
| `{{mood}}`            | Named atmosphere: palette, energy, rendering style                 | **One phrase.** Three mood words → cut to one.                                |

**Length rule: 2–4 sentences.** If you have more, fold short ones together rather than cutting content. Never add a fifth.

## Anchor density — cover every plane

A good prompt anchors every spatial and physical plane. Run this checklist on every base prompt. If a slot is missing, **invent** the anchor rather than skipping it — gaps produce muddy output.

**Traversal mode — all 7 required:**
- **POV**: first/third person, framing
- **Body or vehicle**: saddle, gauntlets, suit, exosuit, viewport, etc.
- **Near plane**: what is directly around the viewer
- **Mid plane**: the focal element or point of approach
- **Far plane**: backdrop, horizon, depth-anchor
- **Atmosphere**: light quality, weather, mood-carrying detail
- **Sensation**: physical cause-and-effect detail (vibration, wind, dust, heat)

**Spectator mode — all 6 required:** drop "Body or vehicle"; keep POV (fixed framing + distance to subject), Near, Mid, Far, Atmosphere, Sensation.

## Worked example (traversal — dune approach)

Rough idea: *"a dune buggy heading toward a sand-buried temple."*

```
The video presents a low-altitude race across a sun-baked dune sea toward a
colossal sand-buried temple. Dust trails spin off the cracked rear cowling in
fine thermal threads, and the leather-wrapped throttle in the driver's gloved
hand vibrates against scoured chrome. The half-buried obelisks of the temple
resolve steadily, their carved glyphs becoming clearer against a horizon of
heat-haze warping the distant escarpment. Dry, blinding noon.
```

All 7 anchors present · 4 sentences · one mood phrase · zero camera verbs.
POV "low-altitude race" · vehicle cowling/throttle/chrome · near = dust off the cowling · mid = obelisks resolving · far = heat-haze escarpment · atmosphere "dry, blinding noon" · sensation dust threads + throttle vibration · motion-resolution "glyphs becoming clearer against [escarpment]".

## Hold-prompts: press to overlay, release to revert

Hold-prompts are the default interactivity pattern: a **base prompt** plus 1–9 alternative full prompts the client fires (`set_prompt` again) while a hotkey is held, reverting on release. **There is no special API** — a hold-prompt is just another `set_prompt` call.

A hold-prompt is a **complete alternative scene description**, mirroring the base's sentence count and anchor density (not a short trigger). Two flavors:

- **Local events**: inject one element; the world stays the same. Fireworks, lightning, fire breath, a shield raising. *"…now ringed by a wall of fire…"*
- **Global events**: replace atmosphere, lighting, or style; geometry stays, surfaces are re-skinned. Night mode, winter, steampunk, pixel art.

**Surface-propagation rule for global holds:** if the hold changes lighting/atmosphere, you **must** update preserved surfaces to match. A "now at night" prompt that still says "noon sun on the chrome" contradicts itself, and the model splits the difference badly. Re-skin every surface anchor the lighting touches.

**Anchor to the base — describe the delta.** If the base says "a dune buggy," the hold doesn't re-say it; it describes what changed.

## Critical rules

**DO:**
- Anchor every plane (7 for traversal, 6 for spectator); invent missing anchors.
- Start traversal with "The video presents"; start spectator with the scene anchor.
- Keep to 2–4 sentences and end on **one** mood phrase.
- Use positional framing language ("rear view," "low-angle," "centered in frame").
- Always fill the **sensation** slot — it's the most load-bearing and most-skipped.
- Make hold-prompts full re-prompts with the same anchor density as the base.
- Re-skin preserved surfaces when a global hold changes lighting.

**DON'T:**
- Use camera-motion verbs (pan/tilt/dolly/track/zoom/orbit/push/pull/fly).
- Put more than one destination or focal event in a prompt (competing spatial gradients blur output).
- Stack three+ mood words (they cancel out — keep the most physically anchored one).
- Use image-model tag stacks ("cinematic, 8k, volumetric, depth of field") — they don't steer LingBot.
- Exceed 4 sentences (densify within sentences via clauses instead).
- Default sparse input to "golden hour / dawn mist / glass-smooth lake" — anchor to the environment's actual physics.
- Re-state subject identity inside a hold-prompt — anchor to the base, describe only the delta.

## Runtime caveats (affect how a prompt plays out)

- **Context length ~300 chunks.** The model drifts back toward the seed image over long sessions. Plan scene transitions around that rather than fighting it.
- **Movement stability.** `W` (forward) is the most reliable direction. Lateral strafing (`A`/`D`) is worst-case and can displace the camera off a centered subject — route direction changes through forward + heading turn (`W` + look left/right) rather than pure strafe.
- **Orbiting support varies by subject.** Horses/cars orbit cleanly under look-input; boats/dragons may not. Prototype with the seed before committing to free 360° look.
- **Character budget ~2000 chars** (umt5-xxl encoder; hard cap ~512 tokens). Well-anchored prompts sit at 500–900 chars. If you approach the ceiling, drop redundant subject descriptions before cutting spatial anchors. Use the [token playground](https://video-prompt-tokens-playground.vercel.app/) to verify.
- **Idle drift.** Extended periods with the same prompt and no control input cause drift. Fire periodic `set_prompt` refreshes or movement inputs on long idle sessions.

## Checklist

Before finalizing any LingBot prompt:

- [ ] Mode chosen (traversal vs spectator) and opener matches ("The video presents" vs scene anchor)
- [ ] All anchors present (7 traversal / 6 spectator); missing ones invented, not skipped
- [ ] Sensation slot filled with a real physical detail
- [ ] Exactly one destination / focal event
- [ ] 2–4 sentences, ends on one mood phrase
- [ ] Zero camera-motion verbs
- [ ] No image-model tag stacks
- [ ] Hold-prompts (if any) are full re-prompts with matching anchor density
- [ ] Global holds re-skin every surface the new lighting touches
- [ ] Under ~2000 characters
