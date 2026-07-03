# Contain hero constellation to the right column

## Goal
Left ~45% of hero is text-only with no 3D elements overlapping. 3D scene lives on the right ~55%, with a dark scrim guaranteeing WCAG AA legibility even if elements drift.

## Changes

### 1. `src/routes/index.tsx` (hero section only)
- Replace the full-bleed desktop canvas (`absolute inset-0`) with a right-side wrapper: `hidden lg:block absolute right-0 top-0 h-full w-[55%]` containing `<HeroCanvas className="absolute inset-0" />`.
- Add a dark-to-transparent scrim over that canvas wrapper: `absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none z-10` (canvas z-0, scrim z-10, text column relative z-20).
- Remove the per-text-column scrim (`-inset-6 rounded bg-gradient-to-r ...`) since it's no longer needed once the scene is contained.
- Keep grid `lg:grid-cols-[minmax(0,560px)_1fr]`, spacer column, and mobile band untouched (mobile already stacks correctly).
- Ensure text column has `relative z-20`.

### 2. `src/components/gtp/HeroConstellation.tsx` (composition shift + scale)
Shift all scene anchors right and scale card down ~15% so nothing extends into the left half of the canvas viewport:
- `corePos`: `(2.6, 0, -0.4)` → `(1.6, 0, -0.4)` (canvas now only covers right half of hero; keep core visually centered within it).
- `cardPos`: `(-0.2, 0.15, 0.8)` → `(-0.6, 0.15, 0.8)` — after camera reframing the card sits centered within the narrower canvas rather than bleeding left.
- Card plane geometry: `[3.5, 2.21]` → `[2.98, 1.88]` (~15% smaller).
- Node bases shifted left by ~1.2 so they stay inside the narrower right canvas:
  - Wallets: `(4.9, 1.35, -0.9)` → `(3.7, 1.35, -0.9)`
  - Acceptance: `(5.2, -1.15, -0.7)` → `(4.0, -1.15, -0.7)`
  - Payouts: `(0.9, 1.9, -1.1)` → `(-0.3, 1.9, -1.1)`
  - Collections: `(1.1, -1.9, -1.0)` → `(-0.1, -1.9, -1.0)`
- Camera unchanged (`fov 44`, `z 10`) — since the canvas element itself is now narrower, the visible frustum naturally crops the left side; combined with the shifts above, no element renders past the canvas's left edge into the text column.
- Motion, pulses, particles, rails, parallax: unchanged.

### 3. Mobile
Already stacks (text above, `lg:hidden` 320px canvas band below). No change needed; verify no regressions.

## Verification
- Playwright at 1440×900: screenshot hero, confirm card/nodes sit right of the text column and text is fully readable.
- Playwright at 390×844: confirm mobile still stacks.
- Confirm scrim gradient present on desktop and no console errors.

## Out of scope
Other sections, i18n copy, tokens, StickyNav/Footer, scene motion or pulse timing.
