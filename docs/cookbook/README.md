# Reactor Model Cookbooks

Prompting cookbooks for the four real-time video models hosted on Reactor. Each is a deep guide — template, worked examples annotated by slot, named recipes, a mistake gallery, and a validation checklist. They cover **prompting only**; for SDK / auth / frontend patterns, read the matching `skills/<model>-prompts/SKILL.md`.

| Model | What it does | Prompt is… | Cookbook | Skill |
| --- | --- | --- | --- | --- |
| **LingBot** | Navigable world you drive with WASD + look | A 2–4 sentence world description (seed image + controls do the rest) | [lingbot.md](lingbot.md) | [SKILL](../../skills/lingbot-prompts/SKILL.md) |
| **Helios** | Continuous stream you steer by swapping prompts | A *sequence*: start prompt + one-change follow-ups | [helios.md](helios.md) | [SKILL](../../skills/helios-prompts/SKILL.md) |
| **LongLive 2** | Multi-shot, text-to-video storyboard | A five-paragraph caption per shot (no image input) | [longlive-v2.md](longlive-v2.md) | [SKILL](../../skills/longlive-v2-prompts/SKILL.md) |
| **SANA-Streaming** | Real-time video-to-video editor | An *edit instruction* over a live source (not a scene) | [sana-streaming.md](sana-streaming.md) | [SKILL](../../skills/sana-streaming-prompts/SKILL.md) |

## Picking a model by intent

- **"Let me walk/fly through it."** → LingBot (interactive, image-anchored world).
- **"Play me a scene that evolves."** → Helios (continuous, prompt-steered, no controls).
- **"Direct a multi-scene video like a storyboard."** → LongLive 2 (shots + cuts, text-only).
- **"Restyle my webcam / a clip in real time."** → SANA-Streaming (video-to-video editing).

## The one rule that differs per model

- LingBot — **never** describe camera motion; the controls drive the camera.
- Helios — keep the **camera line verbatim** and change **one** thing per follow-up.
- LongLive 2 — choose **shot vs cut** correctly; repeat object attributes verbatim across shots.
- SANA-Streaming — write a **diff, not a scene**; name what changes and what stays.
