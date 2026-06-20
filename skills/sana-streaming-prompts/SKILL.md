---
name: sana-streaming-prompts
description: Write effective prompts for Reactor's SANA-Streaming model, a real-time, streaming video-to-video editor steered with text. Use when creating SANA-Streaming prompts, video-edit instructions, webcam/clip transforms, or when the user mentions SANA, streaming V2V, or "edit my video/webcam with a prompt." Covers the edit-instruction mindset (not scene description), what-changes-vs-what-stays phrasing, mid-stream re-prompting, and drift control with the anchor interval.
---

# SANA-Streaming Prompt Writing

SANA-Streaming is a **real-time, streaming video-to-video editor**. You stream a source into the model on the `camera` track — your **webcam** or a **pre-recorded clip** — and a text prompt describes a **change**. The model applies that change while everything you don't mention carries through from the source. Edited frames stream back on `main_video` in 24-frame chunks (~1–1.5 s each).

The prompt is **optional**: with no prompt, the model streams the source back nearly untouched. Set or change one at any time — including mid-stream — to steer the edit.

## The one mental-model shift

**A SANA prompt is an editing instruction, not a scene description.** This is the opposite of LingBot/Helios/LongLive, where the prompt describes a whole world from scratch.

Here the source already supplies subject, motion, geometry, and timing. Your prompt names **what should change** and (when it matters) **what should stay**. Everything you don't mention persists from the source frame.

| ❌ Scene-description thinking (wrong)                              | ✅ Edit-instruction thinking (right)                                                |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| "A person sitting at a desk in a sunlit room, typing on a laptop." | "Turn the desk lamp light into warm candlelight; keep the person and laptop unchanged." |
| "A snowy forest with a cabin."                                    | "Add falling snow and frost the windows; leave the cabin structure and trees as they are." |
| "An anime character waving."                                     | "Restyle the footage as cel-shaded anime with bold outlines; preserve the motion and framing." |

## Structure of a good edit instruction

Strong instructions run 2–5 sentences with these components in order:

1. **Target identification** — disambiguate with specific attributes ("the white button-up shirt," not "the shirt")
2. **New content details** — 2–4 concrete specifics: material, color, silhouette, texture. More than 4 adjectives degrades results.
3. **Material physics clause** — describe how the new content behaves under the *existing* light ("the silk catches and reflects the warm golden lamp light with a subtle sheen")
4. **Fixed elements enumeration** — name what stays unchanged: "preserve the subject's pose, body and head motion, her identity, the background, and the scene's depth of field and lighting"
5. **Temporal consistency** — for whole-frame edits, assert "seamless temporal consistency across all frames"

Rules:
- **One edit per prompt.** Split combined instructions into separate prompts.
- **Match motion claims to the footage.** "Perfectly still" only if footage is static; otherwise use "preserve existing motion."
- **Name what stays** — the model preserves only what you explicitly enumerate. "Keep everything else the same" is too vague.

## Seven edit recipes

| Recipe | When to use | Key pattern |
| --- | --- | --- |
| **Remove** | Delete objects, watermarks, blemishes | Name target → describe how to reconstruct the revealed area → "no trace" |
| **Replace** | Swap garments, objects, subjects | Old → new with ≤4 details → material physics clause → enumerate what's preserved |
| **Add** | Overlay new tracked elements | Element description → location → movement → tracking assertion |
| **Background** | Change setting behind a preserved subject | New background elements → hold foreground subject → match lighting |
| **Style** | Repaint in an art style | Name style → visual characteristics (strokes, palette, outlines) → preserve motion/composition |
| **Scene transform** | Rebuild scene in a new medium | List objects to convert → target medium → add period artifacts → preserve original timing |
| **Physical AI** | Restyle driving/robotics footage | Describe new look → preserve domain invariants (road geometry, lane markings, motion) |

## Examples (verbatim from official prompt guide)

**Remove:**
> "Remove the white 'GagaOOLala' watermark logo in the top-left corner. Seamlessly blend the region with the surrounding sky, foliage, and building edges, with temporally consistent inpainting."

**Replace (garment):**
> "Replace the white button-up shirt with a dark navy silk blouse featuring a draped ruffled collar and iridescent pearl buttons. Ensure the silk catches and reflects the warm golden lamp light with a subtle sheen throughout the sequence. Preserve the subject's pose, body and head motion, her identity, the background, and the scene's depth of field and lighting."

**Style:**
> "Apply a Fauvist painting style with electric blues, greens, and oranges, thick brushstrokes, bold outlines, and flat saturated color blocks. Preserve all original motion, actions, camera movement, and composition, with seamless temporal consistency and no jarring frames."

**Background:**
> "Replace the background with a rain-streaked windowpane at dusk, with out-of-focus teal and amber city lights, condensation, and raindrops trickling down the glass. Keep a shallow depth of field, do not alter the subject's lighting or appearance, and maintain seamless consistency across all frames."

## Mid-stream re-prompting

`set_prompt` is valid at any time, including mid-stream. A change **lands at the next chunk boundary** — about one chunk (~1–1.5 s) later, not instantly. Sequence edits by re-prompting rather than cramming everything into one instruction:

```
t=0   "Restyle as watercolor painting, soft edges; keep the subject's motion and framing."
t=8s  "Shift the watercolor palette to cool blues and deepen the shadows."
t=16s "Add gentle falling cherry blossoms drifting across the frame."
```

Each re-prompt builds on the live edited stream, so phrase the later ones as deltas, not full restatements.

## Drift control — the anchor interval

Over long runs, a continuously re-edited stream can drift away from the source. `set_anchor_interval` periodically re-grounds the edit on the source every N chunks (`0` disables). Each re-ground may show a brief visible refresh. Reach for it when a long session's edit slowly degrades or wanders off the source; leave it off for short clips.

## Critical rules

**DO:**
- Treat the prompt as an **edit instruction** — name the change, not the whole scene.
- Use specific target attributes ("the white button-up shirt," not "the shirt").
- Add a material physics clause ("the silk catches the warm golden lamp light").
- Enumerate the axes to preserve — the model only preserves what you name.
- Keep each prompt to **one coherent edit**.
- Sequence multiple edits over time with mid-stream `set_prompt` deltas.
- Expect a ~one-chunk delay before a new prompt lands.
- Use the anchor interval to limit drift on long runs.

**DON'T:**
- Write a full scene description from scratch — the source already provides the scene.
- Pack multiple unrelated changes into one prompt (they compete and collapse).
- Use more than 4 adjectives for new content details — adjective pileup degrades results.
- Restate the entire edit on every mid-stream change — phrase later prompts as deltas.
- Claim the footage is "perfectly still" if it isn't — match motion claims to actual footage.
- Rely on "keep everything else the same" — enumerate the specific axes instead.
- Describe scene-from-scratch — rephrase as an edit ("Apply a neon cyberpunk look" not "A neon cyberpunk city").

## Checklist

Before finalizing any SANA-Streaming prompt:

- [ ] Prompt reads as an **edit instruction**, not a scene description
- [ ] What changes is stated first and is one coherent edit
- [ ] What to preserve is named if the edit could destroy it
- [ ] No multiple unrelated changes crammed into one prompt
- [ ] Multi-step edits are sequenced as mid-stream deltas, not one mega-prompt
- [ ] Long sessions consider an anchor interval to control drift
