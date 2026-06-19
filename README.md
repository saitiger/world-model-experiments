# World Model Experiments

Prompting skills, cookbooks, and runnable starter templates for [Reactor](https://reactor.inc)'s real-time video generation models — LingBot, Helios, LongLive v2, and SANA-Streaming.

---

## What's here

| Folder | What it is |
| --- | --- |
| [`skills/`](skills/) | Agent context files (SKILL.md) — the rules each model needs injected into an AI agent's system prompt to produce good output |
| [`docs/cookbook/`](docs/cookbook/) | Deep prompting guides — worked examples, named recipes, mistake galleries, checklists |
| [`starter-kit/`](starter-kit/) | Runnable app templates — clone, add your API key, build on top |

---

## Models covered

| Model | Kind | Skill | Cookbook |
| --- | --- | --- | --- |
| **LingBot** | Navigable first-person world (WASD) | [skill](skills/lingbot-prompts/SKILL.md) | [cookbook](docs/cookbook/lingbot.md) |
| **Helios** | Continuous prompt-steered video stream | [skill](skills/helios-prompts/SKILL.md) | [cookbook](docs/cookbook/helios.md) |
| **LongLive v2** | Multi-shot text-to-video storyboard | [skill](skills/longlive-v2-prompts/SKILL.md) | [cookbook](docs/cookbook/longlive-v2.md) |
| **SANA-Streaming** | Real-time video-to-video editor | [skill](skills/sana-streaming-prompts/SKILL.md) | [cookbook](docs/cookbook/sana-streaming.md) |

---

## Quick start

**Use the skills** — drop a SKILL.md into your AI agent's context (CLAUDE.md, system prompt, etc.) before it writes prompts for that model.

**Read the cookbooks** — start here if you're writing prompts by hand. Each cookbook has a worked example, named recipes for common patterns, and a mistakes table.

**Run a template** — see [`starter-kit/README.md`](starter-kit/README.md). Two templates ship today:

| Template | Model | Stack |
| --- | --- | --- |
| [`starter-kit/reactor-dragon/`](starter-kit/reactor-dragon/) | LingBot | Next.js 15 + TypeScript |
| [`starter-kit/helios-snap/`](starter-kit/helios-snap/) | Helios | React + Vite |

---

## The one rule per model

Each model has a signature failure mode — the thing that breaks output when ignored:

- **LingBot** — never write camera-motion verbs (`pan`, `zoom`, `dolly`). The WASD controls drive the camera; prompt verbs fight it.
- **Helios** — keep the camera line verbatim across every follow-up, change only one thing per update.
- **LongLive v2** — repeat object attributes word-for-word across shots (continuity relies on exact repetition, not paraphrase).
- **SANA-Streaming** — write a diff (`change X to Y, keep Z`), not a new scene description.

The full rules are in each model's SKILL.md.
