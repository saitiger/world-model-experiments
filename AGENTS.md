# Agent Context: World Model Experiments

You are working in a repo that contains prompting skills, cookbooks, and runnable starter templates for Reactor's real-time video generation models. Your job is to help someone build something with one of these models.

**Start by asking two questions** (if the user hasn't already answered them):

1. What are you building? (A game, an art installation, a creative tool, a demo, something else?)
2. Which Reactor model do you want to use? (If they don't know, use the model selector below.)

Once you have both answers, follow the workflow at the bottom of this file.

---

## Repo Structure

```
world-model-experiments/
├── AGENTS.md                          ← you are here
├── README.md                          ← human-readable overview
│
├── skills/                            ← SKILL.md files (read these into your context)
│   ├── README.md                      ← index + model routing guide
│   ├── lingbot-prompts/SKILL.md       ← LingBot rules
│   ├── helios-prompts/SKILL.md        ← Helios rules
│   ├── longlive-v2-prompts/SKILL.md   ← LongLive v2 rules
│   └── sana-streaming-prompts/SKILL.md← SANA-Streaming rules
│
├── docs/cookbook/                     ← deep prompting guides (worked examples + recipes)
│   ├── README.md                      ← "pick a model by intent" table
│   ├── lingbot.md
│   ├── helios.md
│   ├── longlive-v2.md
│   └── sana-streaming.md
│
└── starter-kit/                       ← runnable app templates
    ├── README.md                      ← run steps + customization points
    ├── reactor-dragon/                ← LingBot template (Next.js 15 + TypeScript)
    └── helios-snap/                   ← Helios template (React + Vite)
```

---

## Model Selector

Ask the user what they want to produce, then match to the right model:

| What the user wants | Model | Why |
| --- | --- | --- |
| A world you can walk through / explore (first-person, WASD) | **LingBot** | Navigable, image-anchored world. Controls drive the camera. |
| A continuous video that evolves as you type new prompts | **Helios** | Prompt-steered stream. No fixed length — runs as long as you want. |
| A multi-shot video from a text description (like a short film) | **LongLive v2** | Shot-by-shot storyboard. Budget-managed scene cuts. Up to ~90 seconds. |
| Change what's on screen in real time (style transfer, recolor, edit) | **SANA-Streaming** | Video-to-video editor. Responds to diff-style edit instructions mid-stream. |

If the user's idea could fit more than one model, ask: "Do you want to navigate through it, or watch it play out?"

- Navigate → **LingBot**
- Watch / generate → **Helios** (open-ended) or **LongLive v2** (structured)
- Edit live video → **SANA-Streaming**

---

## Model Quick Reference

### LingBot — navigable world
- **Use when:** first-person exploration, game-like worlds, interactive environments
- **Prompt shape:** paragraph describing the world from behind the subject + atmosphere + mood. No shot boundaries.
- **One rule:** **never write camera-motion verbs** (`pan`, `zoom`, `dolly`, `fly toward`). WASD controls drive the camera — prompt verbs fight the controls and break the world.
- **Skill:** `skills/lingbot-prompts/SKILL.md`
- **Cookbook:** `docs/cookbook/lingbot.md`
- **Template:** `starter-kit/reactor-dragon/` (Next.js 15 + TypeScript)

### Helios — continuous prompt-steered stream
- **Use when:** open-ended generative video, ambient visuals, art installations, evolving scenes
- **Prompt shape:** structured start prompt (SUBJECT · ENVIRONMENT · LIGHTING · ATMOSPHERE · STYLE · CAMERA), then follow-up prompts that change ONE thing at a time.
- **One rule:** **keep the camera line verbatim across every follow-up**. Camera line is an anchor — change it and the stream destabilizes.
- **Skill:** `skills/helios-prompts/SKILL.md`
- **Cookbook:** `docs/cookbook/helios.md`
- **Template:** `starter-kit/helios-snap/` (React + Vite; photo→style transfer→Helios animate→record)

### LongLive v2 — multi-shot storyboard
- **Use when:** short films, product demos, narrative sequences, text-to-video with scene structure
- **Prompt shape:** 5-paragraph caption per shot (~300 tokens, present tense). Object attributes repeated verbatim across shots for continuity.
- **One rule:** **repeat object descriptions word-for-word across shots**. The model has no scene memory — paraphrase = new object.
- **Skill:** `skills/longlive-v2-prompts/SKILL.md`
- **Cookbook:** `docs/cookbook/longlive-v2.md`
- **Template:** none yet (cookbook + skill available)

### SANA-Streaming — real-time video editor
- **Use when:** live style transfer, interactive editing, creative tools where users control the look in real time
- **Prompt shape:** edit instruction, not a scene description. "Change X to Y. Keep Z." One coherent edit per prompt.
- **One rule:** **write a diff, not a scene**. Describing the full scene overwrites everything; describing only what changes preserves the rest.
- **Skill:** `skills/sana-streaming-prompts/SKILL.md`
- **Cookbook:** `docs/cookbook/sana-streaming.md`
- **Template:** none yet (cookbook + skill available)

---

## Workflow

Once you know what the user is building and which model they're using:

### Step 1 — Read the skill
Read the relevant `skills/<model>-prompts/SKILL.md` into your context in full. This is your ground truth for what the model accepts and rejects. Pay attention to the DO / DON'T section — it contains the failure modes.

### Step 2 — Read the cookbook
Read `docs/cookbook/<model>.md`. It has:
- A worked example annotated by prompt slot
- Named recipes for common patterns (hold-prompt, sequence arc, continuity bed, etc.)
- A mistakes table — check the user's first prompt attempt against this

### Step 3 — Start with a template (if one exists)
If the user's model has a starter template in `starter-kit/`, point them at it:
- **LingBot** → `starter-kit/reactor-dragon/` — customize `app/lib/scenes.ts` and `public/images/`
- **Helios** → `starter-kit/helios-snap/` — customize `ANIMATE_PROMPT` and the Gemini style prompt in `src/App.jsx`

Read `starter-kit/README.md` for run steps and the full list of customization points.

### Step 4 — Write the first prompt together
Apply the skill rules to whatever the user describes. If their idea is vague, ask for:
- A subject (what is the main thing we're looking at?)
- A world or environment (where is it?)
- A mood or atmosphere (what should it feel like?)

Then draft the prompt using the template from the skill, show it to the user, and explain which slots you filled and why.

### Step 5 — Iterate
For follow-up prompts, apply the model's iteration rules from the skill:
- LingBot: hold-prompt or event-overlay, no camera verbs
- Helios: verbatim camera line + one new change
- LongLive v2: repeat object attributes verbatim, mind the 48-chunk shot budget
- SANA-Streaming: one edit per prompt, anchor interval every N prompts to prevent drift

---

## Files to read for each model

| Model | Must read | Also useful |
| --- | --- | --- |
| LingBot | `skills/lingbot-prompts/SKILL.md` | `docs/cookbook/lingbot.md`, `starter-kit/reactor-dragon/app/lib/scenes.ts` |
| Helios | `skills/helios-prompts/SKILL.md` | `docs/cookbook/helios.md`, `starter-kit/helios-snap/src/App.jsx` |
| LongLive v2 | `skills/longlive-v2-prompts/SKILL.md` | `docs/cookbook/longlive-v2.md` |
| SANA-Streaming | `skills/sana-streaming-prompts/SKILL.md` | `docs/cookbook/sana-streaming.md` |
