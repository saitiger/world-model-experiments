# Driving this LingBot app with hand gestures

This folder is Reactor's **official LingBot example** (`@reactor-models/lingbot`). Its
`MovementControls` already attaches a global keyboard listener that maps **WASD → move**
and **arrow keys → look**, sending `set_movement` / `set_look_horizontal` /
`set_look_vertical` (each axis returns to `"idle"` on key release).

The two-hand controller in [`../gesture-control`](../gesture-control) emits exactly those
OS-level key events, so it drives this app (or Reactor's hosted playground) with no
extra wiring:

```
right hand tilt → W/A/S/D (move)      ┐
left hand tilt  → ↑/↓/←/→ (look)      ├─ OS key events → focused browser tab
neutral         → key release → idle  ┘    → MovementControls → set_* commands
```

The Python MOVE hand emits a single dominant direction (LingBot's `movement` is one
value); the LOOK hand emits independent vertical + horizontal arrows (look H/V are
separate axes), so diagonal camera moves work.

## Run the full loop

1. Add your key and start this app (port 3000 is taken by another app, so use 3001):
   ```bash
   cd /Users/sachin/reactor-dragon
   cp .env.example .env        # then set REACTOR_API_KEY=rk_...
   pnpm install
   PORT=3001 pnpm dev          # http://localhost:3001
   ```
2. In the browser: **Connect** → wait for **ready** → pick a scene (or upload an image +
   prompt) → it starts generating.
3. In your **own terminal** (so macOS Accessibility attaches and keys actually reach the
   browser), run the controller:
   ```bash
   /Users/sachin/gesture-control/.venv/bin/python /Users/sachin/gesture-control/dragon_control.py
   ```
   Hold both palms flat → `c` to calibrate. Fix any reversed direction with `x`/`y`
   (move) or `n`/`m` (look).
4. Click the **browser tab** to focus it, press **`g`** in the gesture window, and fly —
   right hand moves, left hand turns the camera.

> Don't need a local copy? The exact same controller drives Reactor's **hosted** LingBot
> playground too — its movement controls are this same component. Just focus that tab.
