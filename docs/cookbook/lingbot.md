# LingBot Cookbook

A prompting cookbook for **LingBot**, Reactor's real-time navigable world model. This goes deeper than the [SKILL.md](../../skills/lingbot-prompts/SKILL.md) with worked examples, named recipes, and a mistake gallery. It covers **prompting only** — for SDK, auth, and frontend wiring, see the LingBot SKILL and the reactor-team examples.

> **Starter template:** the `frontend/` LingBot navigate app (`navigate.html` + `src/navigate.js`) is the runnable reference for this model.

---

## What LingBot is, plainly

You give it a **seed image** (the look of the world), a **paragraph prompt** (what the world is and feels like), and **live controls** (WASD to move, arrows to look). It streams an endless first-person video you drive through in real time. The prompt never moves the camera — the controls do. Your whole job in the prompt is to richly anchor *the world*.

Default output is portrait **480×832**.

---

## The base-prompt template

```
{{world}}. {{sensation}}. {{event}}[, {{motion_resolution}}]. {{mood}}.
```

| Slot | Definition | Example fragment |
| --- | --- | --- |
| `world` | Domain + journey type (where, and how you move) | "a soaring journey through a fantasy jungle" |
| `sensation` | One grounding physical detail (the most-skipped slot) | "the leather throttle vibrates against scoured chrome" |
| `event` | The single thing that moves/resolves/reveals — **one only** | "toward a colossal sand-buried temple" |
| `motion_resolution` | *(traversal only)* texture sharpening as you approach | "its carved glyphs becoming clearer against the heat-haze" |
| `mood` | One named atmosphere phrase | "dry, blinding noon" |

**Two modes, two openers:**
- **Traversal** (you're inside the world, moving): start with **"The video presents…"**. Most scenes.
- **Spectator** (you watch a subject from a fixed point): start with the **scene anchor directly**.

**Anchor every plane** — 7 for traversal (POV · body/vehicle · near · mid · far · atmosphere · sensation), 6 for spectator (drop body/vehicle). Missing a plane? Invent it; don't skip it.

---

## Worked example 1 — traversal (dragon flight)

Rough idea: *"flying a dragon toward a ruined jungle castle."*

```
The video presents a first-person flight from the back of a soaring dragon toward
an ancient ruined castle rising over a primordial jungle. The worn leather saddle
creaks and the reins jerk taut against the dragon's horned head as its obsidian
scales ripple with each wingbeat. The castle's gothic spires resolve through the
humid haze, half-swallowed by creeping vines, river gorges carving the canopy far
below. Golden, heavy afternoon light.
```

| Plane | Where it lands |
| --- | --- |
| POV | "first-person flight" |
| Body/vehicle | "worn leather saddle," "reins," "dragon's horned head" |
| Near | saddle creak, reins jerking |
| Mid | the castle resolving through haze |
| Far | river gorges carving the canopy below |
| Atmosphere | "golden, heavy afternoon light" |
| Sensation | saddle creak + reins jerking taut |

4 sentences · one mood phrase · zero camera verbs. ✅

---

## Worked example 2 — spectator (lakeside dusk)

Rough idea: *"a calm lake at dusk with a heron."* Seed shows the scene from outside, so this is spectator — **no "The video presents."**

```
A still mountain lake at dusk seen from the reed-choked near bank, the water
flat as hammered pewter. Midges drift in slow columns above the shallows and the
reeds tick faintly in the cooling air. A lone grey heron stands mid-frame on a
half-sunk log, occasionally shifting its weight, while the far shore dissolves
into blue pine shadow. Cold, settling blue-hour calm.
```

6 spectator anchors: POV (fixed, near bank) · near (reeds, midges) · mid (the heron on the log) · far (pine-shadow shore) · atmosphere (blue hour) · sensation (reeds ticking, midges drifting). ✅

---

## Recipe: the hold-prompt overlay

Give the user hotkeys that swap the whole scene while held, reverting on release. Each hold is a **full re-prompt** with the same anchor density as the base — not a short trigger. (Mechanically it's just another `set_prompt` call.)

**Base** (dragon flight, above) + two holds:

**Hold 1 — local event (fireworks):** inject one element, keep the world.
```
The video presents a first-person flight from the back of a soaring dragon toward
the ruined jungle castle. Brilliant fireworks burst across the sky above the
spires — red, gold, and emerald blooming in rapid succession — their light
rippling across the dragon's outstretched wings and obsidian scales, smoke trails
spiraling as fresh volleys crack overhead. Golden, heavy afternoon light.
```

**Hold 2 — global event (night):** re-skin every surface the new light touches.
```
The video presents a first-person flight from the back of a soaring dragon toward
the ruined jungle castle at night. The dragon's obsidian scales catch cold
moonlight along the neck and wings, the saddle leather gone blue-black in the
dark, the castle a jagged silhouette against a star-scattered cobalt sky, river
gorges glinting where moonlight catches the water far below. Deep, silver-cold night.
```

Note Hold 2 doesn't just say "now at night" — the scales, the saddle leather, the castle, and the water are all re-described under moonlight. That's the **surface-propagation rule**: a global relight must update every preserved surface or the model splits the difference badly.

---

## Recipe: rescuing a sparse idea

User gives you *"a cool cyberpunk street."* That's one plane (mid) and a cliché mood. Build outward by filling every missing anchor with invented-but-physical detail:

```
The video presents a slow walk down a rain-slicked cyberpunk alley toward a
neon-choked night market. Cold mist beads on the collar of a worn synth-leather
coat and puddles split every reflection underfoot. Holographic noodle-stall signs
flicker ahead in magenta and cyan, steam venting from a grate at knee height,
while the alley mouth opens onto a canyon of lit megablocks dissolving into smog.
Wet, electric midnight.
```

The fix is never "add adjectives" — it's "name the near plane, the body, the sensation, the far plane." Specificity per plane beats decoration.

---

## Common mistakes

| Mistake | Why it hurts | Fix |
| --- | --- | --- |
| Camera verbs ("the camera pans across…") | Generates phantom camera motion that fights the user's controls | "A snowy ridgeline breaking at our level" |
| Two destinations | One focal slot — competing spatial gradients blur output | Pick one; make the other a far-plane backdrop |
| Three mood words ("eerie, melancholy, desolate, vast") | Mood phrases cancel each other | Keep the most physically anchored one |
| Image-model tag stack ("cinematic, 8k, volumetric, DOF") | Midjourney/SD conventions don't steer LingBot | End on one prose mood phrase |
| Skipping the sensation slot | World reads flat — it's the most load-bearing anchor | Add wind/dust/vibration/heat: a real cause-and-effect detail |
| Sparse → "golden hour / dawn mist / glass lake" | The pretty-cliché read; anchors to nothing | Anchor to the environment's actual physics |
| Restating subject identity in a hold | Wastes the budget; the base already established it | Anchor to the base, describe only the delta |
| 5+ sentences | Over the cap; encoder may truncate anchors | Fold short sentences together; densify with clauses |

---

## Runtime caveats that change how you prompt

- **~300-chunk context** before the model drifts back to the seed — design transitions around the drift, don't fight it.
- **Strafing (A/D) displaces a centered subject** — design scenes around forward motion; keep strafes brief.
- **Orbiting support varies** — horses/cars orbit cleanly under look-input, boats/dragons may not. Prototype before committing to 360° look.
- **~2000-char ceiling** (T5-XXL). Good prompts sit at 500–900. Over budget? Cut redundant subject words before spatial anchors.

---

## Validation checklist

- [ ] Mode + opener match (traversal "The video presents" / spectator scene anchor)
- [ ] All anchors present (7 traversal / 6 spectator), none skipped
- [ ] Sensation slot has a real physical detail
- [ ] Exactly one destination / focal event
- [ ] 2–4 sentences ending on one mood phrase
- [ ] Zero camera-motion verbs, zero tag stacks
- [ ] Holds (if any) are full re-prompts; global holds re-skin every relit surface
- [ ] Under ~2000 characters
