# Chyako Cutz — Design System

## Color strategy: Committed
Gold carries the accent role across the dark surface.

## Palette
- `--black`: `#0d0d0b` (near-black, warm tint)
- `--gold`: `#e8c268`
- `--gold-dim`: `rgba(232,194,104,0.68)`
- `--cream`: `#f0ece0`
- `--cream-dim`: `rgba(240,236,224,0.55)`
- `--surface`: `#141412`
- `--surface-2`: `#1c1c19`
- `--border`: `rgba(240,236,224,0.08)`

## Typography
- Display / headings: Pirata One (serif, high drama)
- Body / UI: Space Grotesk (geometric sans, tight tracking)
- UI labels: ALL CAPS, letter-spacing 0.1–0.2em
- No sentence case in UI chrome — all-caps is the brand voice

## Elevation
- Sheets slide up from the bottom (full-screen overlays)
- Cards: `background: var(--surface-2)`, `border: 1px solid var(--border)`
- No shadows — depth via color contrast only

## Motion
- Sheet slide-in: 280ms ease-out
- Button press: scale(0.97) 120ms
- No bounce, no elastic

## Key components
- `.svc-card` — service selection card, full-width, number prefix
- `.barber` — barber selection card
- `.day` — date picker pill
- `.slot` — time slot pill, 15-min grid
- `.ticket` — booking confirmation receipt
- `.btn-primary` — gold fill, near-black text
- `.btn-outline` — transparent, gold border+text
- `.btn-danger` — red tint, cancel actions
- `.sheet` — full-screen sliding panel
