## Goal
Push the 3D constellation further to the right so it clears the hero text column on desktop, especially at ~1052px where the card currently overlaps the sub-paragraph.

## Changes

### `src/components/gtp/HeroConstellation.tsx`
- Shift the whole scene right by moving the anchor positions:
  - `corePos`: `(2.4, 0, -0.4)` → `(3.4, 0, -0.4)`
  - `cardPos`: `(0.75, 0.1, 0.9)` → `(1.9, 0.1, 0.9)`
  - Nodes (all `x` values shifted right by ~1.0):
    - Wallets `[4.45, 1.25, -0.7]` → `[5.45, 1.25, -0.7]`
    - Acceptance `[4.7, -1.1, -0.6]` → `[5.7, -1.1, -0.6]`
    - Payouts `[1.15, 1.95, -1.0]` → `[2.15, 1.95, -1.0]`
    - Collections `[1.35, -1.9, -0.9]` → `[2.35, -1.9, -0.9]`
- Adjust the narrow-desktop reframe so the shifted composition still fits:
  - width < 1100: scale `0.78`, `position.x = -0.9`
  - width < 1300 (new mid tier): scale `0.9`, `position.x = -0.4`
  - else: scale `1`, `position.x = 0`

### `src/routes/index.tsx`
- Strengthen the scrim so any residual left-side glow stays behind the text:
  - Change stop at 46% from `rgba(4,19,31,0.55)` → `rgba(4,19,31,0.75)` and the 64% stop from `0.1` → `0.35`, keeping the right edge transparent.

## Verification
- Playwright at 1440×900, 1200×900, 1052×842, 1100×800: confirm the card and Payouts/Collections nodes sit fully to the right of the text column with no overlap, and nothing clips at the right edge.
