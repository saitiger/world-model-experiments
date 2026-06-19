# Reactor Model Skills

Agent-context `SKILL.md` files for the real-time video models hosted on Reactor. Each one is **self-contained**: load a single `SKILL.md` into an AI agent's context and it has enough to write correct prompts and reason about that model without any other doc. The format follows [`reactor-team/reactor-skills`](https://github.com/reactor-team/reactor-skills/blob/main/skills/helios-prompts/SKILL.md) — frontmatter (`name` + routing `description`) → model overview → prompt/command structure → critical DO/DON'T rules → checklist.

| Skill | Model | When an agent should load it |
| --- | --- | --- |
| [lingbot-prompts](lingbot-prompts/SKILL.md) | LingBot | Writing prompts/hold-prompts for a navigable WASD world |
| [helios-prompts](helios-prompts/SKILL.md) | Helios | Writing a start prompt + follow-up sequence for continuous video |
| [longlive-v2-prompts](longlive-v2-prompts/SKILL.md) | LongLive 2 | Writing multi-shot storyboards (shots + cuts), text-to-video |
| [sana-streaming-prompts](sana-streaming-prompts/SKILL.md) | SANA-Streaming | Writing edit instructions for real-time video-to-video |

For deeper prompting guidance — worked examples, named recipes, and mistake galleries — see the matching cookbooks in [`docs/cookbook/`](../docs/cookbook/).

> **Helios note:** `helios-prompts/SKILL.md` is a local mirror of the upstream `reactor-team/reactor-skills` file (the format reference for the other three). The upstream copy is authoritative.
