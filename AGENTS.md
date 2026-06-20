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

| What the user wants | Model | Inputs required |
| --- | --- | --- |
| A world you can walk through / explore (WASD, first-person or third-person) | **LingBot** | Seed image + text prompt (both required) |
| A continuous video that evolves as you type new prompts, optionally from a photo | **Helios** | Text prompt (required) + optional reference image |
| A multi-shot video from text — like a short film or storyboard | **LongLive v2** | Text only (no images in this release) |
| Edit or restyle an existing video or live webcam feed in real time | **SANA-Streaming** | Existing video or webcam feed + edit instruction |

**Critical input check before choosing:**
- If the user doesn't have a seed image → LingBot is blocked. Suggest Helios or LongLive v2 instead.
- If the user has no existing video/webcam → SANA-Streaming is blocked. It edits; it does not generate from scratch.
- If the user wants to generate from a text description with no source media → LongLive v2 (structured) or Helios (open-ended).

**Tiebreakers:**
- "Navigate through it" → **LingBot** (if they have a seed image)
- "Watch it play out, open-ended" → **Helios**
- "Watch it play out, with structured scenes/cuts" → **LongLive v2**
- "Change what's already on screen" → **SANA-Streaming**

---

## Model Quick Reference

### LingBot — navigable world
- **Use when:** first-person exploration, game-like worlds, interactive environments the user can drive through
- **Inputs:** seed image (required) + text prompt (required). Both must agree — the prompt must match what the image shows.
- **Prompt shape:** 2–4 sentence paragraph covering FOV, near/mid/far planes, atmosphere, sensation. No shot boundaries.
- **One rule:** **never write camera-motion verbs** (`pan`, `zoom`, `dolly`, `fly toward`). WASD controls drive the camera — prompt verbs fight the controls.
- **Alignment check:** text ↔ image ↔ current movement command. All three must agree or output degrades.
- **Skill:** `skills/lingbot-prompts/SKILL.md`
- **Cookbook:** `docs/cookbook/lingbot.md`
- **Template:** `starter-kit/reactor-dragon/` (Next.js 15 + TypeScript)

### Helios — continuous prompt-steered stream
- **Use when:** open-ended generative video, ambient visuals, art installations, image-to-video animation
- **Inputs:** text prompt (required) + optional reference image for image-to-video mode.
- **Prompt shape:** structured start prompt (SUBJECT · ENVIRONMENT [near/mid/far] · LIGHTING · ATMOSPHERE · STYLE · CAMERA), then follow-up prompts that change ONE thing at a time.
- **Token cap:** 512 tokens hard limit. Verify with the [token playground](https://video-prompt-tokens-playground.vercel.app/).
- **One rule:** **keep the camera line verbatim across every follow-up**. Camera line is an anchor — change it and the stream destabilizes.
- **Style rule:** name the style once in the opening prompt. In follow-ups, reinforce with embedded atmospheric cues, never re-declare.
- **Skill:** `skills/helios-prompts/SKILL.md`
- **Cookbook:** `docs/cookbook/helios.md`
- **Template:** `starter-kit/helios-snap/` (React + Vite; photo → style transfer → Helios animate → record)

### LongLive v2 — multi-shot storyboard
- **Use when:** short films, product demos, narrative sequences, text-to-video with structured scenes
- **Inputs:** text only — no reference images in this release.
- **Prompt shape:** 5-paragraph caption per shot (~300 tokens, present tense, dense prose). Object attributes repeated verbatim for continuity.
- **Budget:** 48 chunks (~58 s) per scene. Use `scene_cut` (not `set_shot`) to extend past one scene.
- **One rule:** **repeat object descriptions word-for-word across shots**. The model has no image anchor — paraphrase = visually new object.
- **Skill:** `skills/longlive-v2-prompts/SKILL.md`
- **Cookbook:** `docs/cookbook/longlive-v2.md`
- **Template:** none yet (cookbook + skill available)

### SANA-Streaming — real-time video editor
- **Use when:** live style transfer, restyling webcam/clips, surgical edits to existing video
- **Inputs:** existing video file (min 33 frames) or live webcam feed. **This model edits; it does not generate from scratch.**
- **Prompt shape:** edit instruction with 5 components — target identification, new content details (≤4), material physics, fixed elements list, temporal consistency assertion.
- **7 recipes:** Remove · Replace · Add · Background · Style · Scene Transform · Physical AI
- **One rule:** **write a diff, not a scene**. Enumerate what changes and what stays; the model only preserves what you explicitly name.
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
