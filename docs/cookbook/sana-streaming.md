# SANA-Streaming Cookbook

A prompting cookbook for **SANA-Streaming**, Reactor's real-time, streaming video-to-video editor. This goes deeper than the [SKILL.md](../../skills/sana-streaming-prompts/SKILL.md) with worked edit sequences, named recipes, and a mistake gallery. It covers **prompting only** — for SDK, the `camera`-track publish flow, webcam vs clip sources, and frontend wiring, see the SANA SKILL and the reactor-team examples.

---

## What SANA-Streaming is, plainly

You feed it a live source — your **webcam** or a **pre-recorded clip** — and a prompt that describes a **change**. It restyles/edits the stream in real time and sends the result back, while everything you don't mention carries through from the source. The prompt is **optional**: no prompt ≈ source passed through untouched; set one (any time, including mid-stream) to steer the edit.

Because the source already supplies the subject, motion, geometry, and timing, this is the one Reactor model where you do **not** describe a whole scene.

---

## The mental-model shift (read this twice)

**A SANA prompt is an edit instruction, not a scene description.**

| Other Reactor models | SANA-Streaming |
| --- | --- |
| Describe the entire world from scratch | Name only what should change |
| Prompt *is* the content | Source is the content; prompt is the **diff** |
| Add detail to add richness | Add detail only to control what changes / what stays |

If you catch yourself writing "A person sitting at a desk in a sunlit room…", stop — the model can already see the person, the desk, and the room. Write what's *different*.

---

## Edit-instruction template

```
[WHAT CHANGES]   The transformation: style, lighting, color, added/removed elements, materials.
[WHAT STAYS]     (when it matters) Source attributes to protect: identity, motion, framing.
```

- **Lead with the change**, phrased as an imperative: "Restyle as…", "Recolor the…", "Add…", "Turn the … into …".
- **Name what to preserve** whenever the edit could eat it (faces under heavy style transfer, skin under a recolor).
- **One coherent edit per prompt.** Stack changes over *time* with re-prompts, not within one instruction.

---

## Worked example 1 — style transfer with identity preserved

Source: a webcam talking-head.

```
Restyle the footage as hand-painted cel-shaded anime with bold black outlines and
flat color fills. Keep the person's facial features, expression, and head motion
intact, and preserve the framing.
```

The second sentence is doing real work: without "keep the facial features… intact," a heavy style transfer can dissolve identity frame to frame. Naming what stays stabilizes it.

## Worked example 2 — local recolor without bleed

Source: a clip of someone in a grey jacket.

```
Change only the jacket to deep crimson with a soft matte finish. Leave the
person's skin, hair, and the background exactly as they are.
```

Leading with "change only the jacket" plus an explicit preserve-list keeps the recolor from bleeding into skin and backdrop — the classic V2V failure.

---

## Recipe: sequence an edit over time (mid-stream deltas)

A new prompt lands at the **next chunk boundary** (~1–1.5 s later), not instantly. Build a compound look as a series of small deltas, each phrased relative to the live edited stream — not a fresh full restatement:

```
t=0    "Restyle as loose watercolor with soft bleeding edges; keep the subject's
        motion and framing."
t=8s   "Shift the watercolor palette toward cool blues and deepen the shadows."
t=16s  "Add a few cherry blossoms drifting slowly across the frame."
t=24s  "Let the blossoms thin out and warm the palette back toward amber."
```

Each line assumes the previous edit is already applied. Restating the whole look every time fights the running edit and wastes the chunk.

## Recipe: long-run drift control

On long sessions a continuously re-edited stream can wander off the source. Set an **anchor interval** (`set_anchor_interval`, every N chunks; `0` disables) to periodically re-ground the edit on the source. Each re-ground may show a brief visible refresh — worth it when a long edit slowly degrades; skip it for short clips.

---

## Common mistakes

| Mistake | Why it hurts | Fix |
| --- | --- | --- |
| Writing a full scene description | The source already supplies the scene; you fight it | Describe only the change |
| Multiple unrelated changes in one prompt | They compete and the result collapses to one | One coherent edit; sequence the rest over time |
| No preserve-clause on a destructive edit | Heavy style transfer eats faces / recolors bleed | Name what stays ("keep the face and motion intact") |
| Restating the whole look on every re-prompt | Fights the running edit, wastes the chunk | Phrase mid-stream prompts as deltas |
| Expecting an instant change | Edits land at the next chunk boundary (~1 chunk) | Allow ~1–1.5 s; don't double-send |
| Re-describing motion/timing the source has | Redundant; can introduce conflict | Only mention motion if you're changing it |
| Drift on long runs left unmanaged | Edit wanders away from the source | Set an anchor interval to re-ground periodically |

---

## Validation checklist

- [ ] Prompt reads as an **edit instruction**, not a scene description
- [ ] What changes is stated first, as one coherent edit
- [ ] What to preserve is named if the edit could destroy it
- [ ] No multiple unrelated changes crammed into one prompt
- [ ] Multi-step edits sequenced as mid-stream deltas, not one mega-prompt
- [ ] ~1-chunk latency accounted for (no instant-change assumption)
- [ ] Long sessions consider an anchor interval for drift control
