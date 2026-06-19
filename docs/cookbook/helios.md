# Helios Cookbook

A prompting cookbook for **Helios**, Reactor's real-time, prompt-driven continuous video model. This goes deeper than the [SKILL.md](../../skills/helios-prompts/SKILL.md) with worked sequences, named recipes, and a mistake gallery. It covers **prompting only** — for SDK, auth, and frontend wiring, see the Helios SKILL and the reactor-team examples.

---

## What Helios is, plainly

Once started, Helios produces an **unending video stream** on a single track. You steer it by **swapping the prompt mid-stream** — the model picks up the new prompt on the next chunk and the scene evolves without restarting. So you don't write *one* prompt; you write a **sequence**: a start prompt that establishes the scene, then follow-ups that each add exactly one change while holding everything else steady.

The craft is **controlled continuation**: keep the subject, lighting, and camera identical so the scene flows; change one thing at a time so the motion reads as intentional.

---

## Start-prompt template

```
[SUBJECT]       2-3 sentences. Named, specific: physical detail, clothing, posture.
[ENVIRONMENT]   2-3 sentences. Setting, props, background. Concrete nouns.
[LIGHTING]      1 sentence. Source + quality. ← this becomes the "lighting anchor."
[ATMOSPHERE]    1 sentence. Emotional tone.
[STYLE]         1 sentence, optional. Only if non-default (VHS, anime, vintage).
[CAMERA]        1 sentence. Shot + angle + focus. ← copied VERBATIM to every follow-up.
```

Two lines are **anchors** you repeat across the whole sequence: the **lighting** (minor wording variation OK) and the **camera** (word-for-word identical). Those anchors are what keep a swap from looking like a hard cut.

## Follow-up template

```
[REESTABLISH]   1-2 sentences. Abbreviated restate of subject + position.
[ONE NEW ACTION] 1-2 sentences. Temporal connector ("Suddenly…", "Now…") + a single action.
[ENV REACTION]  1-2 sentences. How the world responds (steam, smoke, reflections, particles).
[LIGHTING ANCHOR] Copied from start.
[CAMERA]        IDENTICAL to start. Not one word different.
```

---

## Worked sequence — "Leo and the butterfly" (4 prompts)

**Prompt 0 — establish:**
```
A majestic lion named Leo rests on a flat sun-warmed rock in the heart of a dense
jungle, his golden mane flowing around broad shoulders, paws crossed in front of
him. Thick ferns and hanging vines crowd the clearing, a shaft of light cutting
through the canopy onto the rock. Warm dappled afternoon sunlight filtering
through the leaves above. Calm, regal stillness. A medium close-up, eye-level,
focused on Leo's face and shoulders.
```

**Prompt 1 — one new action (a butterfly arrives):**
```
Leo remains on the sun-warmed rock, mane settling around his shoulders. Suddenly a
vibrant blue butterfly flutters into the clearing and drifts toward his nose. The
ferns sway faintly in the disturbed air and dust motes turn in the light shaft.
Warm dappled afternoon sunlight filtering through the leaves above. A medium
close-up, eye-level, focused on Leo's face and shoulders.
```

**Prompt 2 — climax (he reacts):**
```
Leo holds his position on the rock as the butterfly settles on the tip of his
nose. He slowly crosses his eyes to look at it, ears flicking, a low rumble in his
chest. Pollen and dust drift around them in the shaft of light. Warm dappled
afternoon sunlight filtering through the leaves above. A medium close-up,
eye-level, focused on Leo's face and shoulders.
```

**Prompt 3 — settle:**
```
Leo relaxes as the butterfly lifts off and spirals upward out of frame. He lowers
his head back onto his crossed paws, eyes half-closing. The ferns still and the
dust settles in the quiet light. Warm dappled afternoon sunlight filtering through
the leaves above. A medium close-up, eye-level, focused on Leo's face and shoulders.
```

Notice across all four: **camera line is verbatim**, the **lighting anchor** barely changes, the subject is **reestablished** each time, and each follow-up adds **exactly one** new action. The butterfly's state progresses (arrives → lands → leaves), which is the second craft skill below.

---

## Recipe: sequence arcs

Optimal length is **4–5 prompts**. Pick an arc and map prompts onto it:

| Arc | Shape | Good for |
| --- | --- | --- |
| Environmental interaction | calm → activate → interact → peak → settle | rain, wind, petals, fireworks hitting a subject |
| Object reveal / transform | initial → transition → reveal → reaction → enjoy | a gift opening, a flower blooming |
| Escalating intensity | calm → first → multiple → peak → sustained | one candle → many; a trickle → a storm |
| Character action | rest → prepare → act → result → settle | a subject performing a small task |

Avoid >6 prompts (coherence degrades) and single follow-ups (no arc).

## Recipe: progressive state tracking

Objects must reflect the **accumulated** state of every prior prompt, or they snap back and the scene jitters. Track each mutable element as a chain and advance it one step per prompt:

```
Candle:   lit → flickering → guttering → extinguished → thin smoke → smoke gone
Petals:   on the branch → loosening → swirling → settling on the blanket → on her face
Hat:      straight → slightly tilted → crooked → slipped over one ear
```

In each follow-up, restate the element at its **current** state, not its starting state.

---

## Common mistakes

| Mistake | Why it hurts | Fix |
| --- | --- | --- |
| Camera line drifts between prompts | Any change reads as a jarring cut | Copy the camera sentence verbatim, every time |
| Dramatic lighting shift (dawn → noon) | Breaks the continuity anchor; scene "resets" | Hold the lighting anchor; only minor wording changes |
| Two+ new actions in one follow-up | The model can't resolve simultaneous changes; output blurs | One action per prompt; split into two prompts |
| Single-line prompt ("a cat chasing a butterfly") | Model invents everything else each chunk → unstable | Full paragraph: subject, environment, lighting, camera |
| Object appears with no introduction | Pops into frame | Introduce with an action verb ("a hand slides a teacup in") |
| Skipping environmental reactions | World feels inert, motion looks fake | Always add steam/smoke/reflection/particle response |
| No subject reestablishment in a follow-up | Identity drifts between chunks | Abbreviated restate of subject + position every time |

---

## Validation checklist

- [ ] Start prompt has subject · environment · lighting · mood · camera
- [ ] Camera instruction is identical in every prompt
- [ ] Lighting anchor consistent (minor wording only)
- [ ] Each follow-up introduces exactly one new action
- [ ] Subject reestablished (abbreviated) in each follow-up
- [ ] Environmental reactions described in each follow-up
- [ ] Progressive object/subject state tracked across the sequence
- [ ] New objects introduced with action verbs
- [ ] Temporal connectors used ("Suddenly", "Now", "As…")
- [ ] Sequence is 4–5 prompts and ends on a peak or resolution
