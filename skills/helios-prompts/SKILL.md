---
name: helios-prompts
description: Write effective prompt sequences for Reactor's Helios model, a real-time video frame generation API. Use when creating Helios prompts, video generation prompts, or when the user mentions Helios or Reactor. Covers start prompts, follow-ups, sequence planning, camera anchoring, lighting consistency, and progressive state tracking.
---

<!--
  Local mirror of reactor-team/reactor-skills/skills/helios-prompts/SKILL.md.
  The upstream file is authoritative; this copy keeps the skills/ folder complete
  alongside lingbot-prompts, longlive-v2-prompts, and sana-streaming-prompts.
-->

# Helios Prompt Writing

Helios generates video sequences through multi-prompt continuation. Each prompt builds on the previous frame state with controlled variations while maintaining visual coherence.

## Start Prompt Structure

Every start prompt follows this exact order:

```
[SUBJECT ESTABLISHMENT]    2-3 sentences. Specific physical details, clothing, posture, name.
[ENVIRONMENT DESCRIPTION]  2-3 sentences. Setting, props, background elements. Concrete details.
[LIGHTING CONDITIONS]      1 sentence. Source + quality. This becomes the "lighting anchor."
[ATMOSPHERE/MOOD]          1 sentence. Emotional tone.
[STYLE (optional)]         1 sentence. Only if non-default (VHS, anime, vintage).
[CAMERA INSTRUCTION]       1 sentence. Shot type + angle + focus. IDENTICAL in every prompt.
```

**Subject**: Not "a lion" but "a majestic lion named Leo." Include name, posture, clothing, key features.

**Environment (3 layers)**: Near (ground level / immediate surroundings), Mid (focal elements), Far (backdrop/horizon). All three give depth and prevent a flat background.

**Lighting anchor**: Describe by its *effect on surfaces*, not by label. "Dappled sunlight filtering through the canopy, illuminating golden hues" — not "good lighting" or "bright." This exact description repeats in every follow-up.

**Camera instruction**: Copied VERBATIM to every prompt. Lock shot type, angle, and focus. Available shot types:
- Close-up · Medium close-up · Medium shot · Wide shot
- Tracking shot · Static shot · Aerial shot
- Add motion modifier: "slow pullback," "smooth tracking shot," "slight pan and pullback"

**Style (when used)**: Name the style **once** in the opening prompt only. In follow-ups, reinforce with embedded atmospheric cues — don't re-declare. Example: open with "90s VHS-style"; later write "VHS static buzzes louder, distorting his face" — not "90s VHS-style weather scene."

## Token budget

**Hard cap: 512 tokens.** Quality degrades noticeably past ~500 tokens. Verify with the [token playground](https://video-prompt-tokens-playground.vercel.app/) before finalizing. Prompt changes only take effect at chunk boundaries (~33 frames per chunk) — space follow-ups to give each beat adequate screen time.

## Follow-Up Prompt Structure

Each follow-up = **Base State + ONE New Action**.

```
[SUBJECT REESTABLISHMENT]       1-2 sentences. Abbreviated restate of position/details.
[NEW ACTION]                    1-2 sentences. Temporal connector + single action.
[ENVIRONMENTAL INTERACTION]     1-2 sentences. How environment reacts (steam, smoke, reflections).
[LIGHTING ANCHOR]               1 sentence. Copied from start, minor wording variations OK.
[ATMOSPHERE (if changed)]       1 sentence. Only if mood shifted.
[CAMERA INSTRUCTION]            IDENTICAL to start prompt. Not one word different.
```

**Reestablishment pattern**: "The [subject] remains/sits/stands [location], [key visuals]. [Clothing reminder]."

**Temporal connectors**: "Suddenly...", "Now...", "As [subject]...", "[Subject] suddenly..."

**Action categories** (pick ONE per prompt):

- Micro-gestures: reaching, turning head, leaning, raising hand
- Object interaction: picking up, setting down, holding
- Facial expression: smiling, eyes widening, mouth opening
- Environmental trigger: breeze starting, something appearing

**Environmental reactions** — always describe how the world responds:

- Objects affected by movement
- Light interacting with surfaces
- Particles (steam, smoke, petals, sparks)
- Reflections changing

## Progressive State Tracking

Track cumulative changes across prompts. Objects and subjects evolve:

- Candles: lit → flickering → extinguished → smoking → smoke dissipated
- Flower: closed bud → separating → half-open → fully bloomed
- Party hat: slightly tilted → crooked → slipped to one side
- Petals: scattered → swirling → covering blanket → landing on face

Each follow-up must reflect the accumulated state from all previous prompts.

## Sequence Planning

**Optimal length: 4-5 prompts.**

| Prompt       | Role                  |
| ------------ | --------------------- |
| 0 (Start)    | Establish scene       |
| 1-2          | Build action          |
| 3            | Climax / payoff       |
| 4 (optional) | Resolution / settling |

Avoid: >6 prompts (coherence degrades), single follow-ups (no arc), unnecessary intermediate steps.

### Common Patterns

Choose one to structure the sequence.

1. **Environmental Interaction** — Subject experiences active environment (rain, wind, petals, fireworks). Calm → activate → interact → peak → settle.
2. **Object Reveal/Transformation** — Something hidden is revealed or changes state. Initial → transition → reveal → reaction → enjoyment.
3. **Escalating Intensity** — Single element increases in quantity/power. Calm → first → multiple → peak → sustained.
4. **Character Action Sequence** — Subject performs related micro-actions. Rest → prepare → act → result → settle.

## Critical Rules

**DO:**

- Keep lighting consistent (only minor wording variations)
- Reestablish subject (abbreviated) in every follow-up
- Introduce exactly ONE new action per follow-up
- Describe environmental reactions (steam, smoke, reflections, particles)
- Use specific object descriptions ("a plastic cake server with a bright green handle")
- Copy camera instruction verbatim to every prompt
- Use temporal connectors to signal changes
- Track progressive state changes across prompts
- Introduce objects with action verbs (picks up, pulls out, grabs)
- Name style once in the opening prompt; reinforce in follow-ups with embedded cues, not re-declarations
- Describe light by how it transforms surfaces ("amber glow washes across the dashboard"), not by label ("good lighting")
- Explicitly name what shouldn't appear ("no people," "cloudless sky") — omission alone doesn't remove elements

**DON'T:**

- Change lighting dramatically (no dawn → noon transitions)
- Stack multiple new actions in one prompt
- Modify the camera instruction between prompts
- Write vague or generic descriptions — use concrete textures, materials, spatial relationships
- Introduce objects without describing how they appear
- Skip environmental reaction descriptions
- Re-declare the full style in every follow-up — embed style cues in the atmosphere instead

## Checklist

Before finalizing any sequence, verify:

- [ ] Start prompt has: subject, environment, lighting, mood, camera
- [ ] Camera instruction identical in every prompt
- [ ] Lighting consistent (minor wording variations only)
- [ ] Each follow-up has exactly ONE new action
- [ ] Subject reestablished (abbreviated) in each follow-up
- [ ] Environmental reactions described
- [ ] Progressive state changes tracked
- [ ] Objects introduced with action verbs
- [ ] No dramatic lighting shifts
- [ ] Temporal connectors used
- [ ] Sequence is 4-5 prompts
- [ ] Final prompt provides resolution or peak moment
