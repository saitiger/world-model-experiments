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

Two clauses, in this order:

```
[WHAT CHANGES]  The transformation: style, lighting, color, added/removed elements, material swaps.
[WHAT STAYS]    (when it matters) The source attributes to preserve: subject identity, motion, framing, composition.
```

- **Lead with the change.** "Make the water turn to molten gold," "Recolor the jacket deep crimson," "Apply a 1970s film look with heavy grain."
- **Name what to preserve when an edit risks eating it.** A style transfer that might dissolve a face → add "keep the person's facial features and expression intact." A recolor that might bleed → "change only the jacket; leave skin and background unchanged."
- **One coherent edit at a time.** Multiple unrelated changes in one prompt compete and the result collapses toward one of them. Stack changes over time with mid-stream re-prompts instead.

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
- Lead with what changes; add what to preserve when the edit might destroy it.
- Keep each prompt to **one coherent edit**.
- Sequence multiple edits over time with mid-stream `set_prompt` deltas.
- Expect a ~one-chunk delay before a new prompt lands.
- Use the anchor interval to limit drift on long runs.

**DON'T:**
- Write a full scene description from scratch — the source already provides the scene.
- Pack multiple unrelated changes into one prompt (they compete and collapse).
- Restate the entire edit on every mid-stream change — phrase later prompts as deltas.
- Expect an instant change — it applies at the next chunk boundary.
- Describe motion/timing the source already supplies unless you intend to change it.

## Checklist

Before finalizing any SANA-Streaming prompt:

- [ ] Prompt reads as an **edit instruction**, not a scene description
- [ ] What changes is stated first and is one coherent edit
- [ ] What to preserve is named if the edit could destroy it
- [ ] No multiple unrelated changes crammed into one prompt
- [ ] Multi-step edits are sequenced as mid-stream deltas, not one mega-prompt
- [ ] Long sessions consider an anchor interval to control drift
