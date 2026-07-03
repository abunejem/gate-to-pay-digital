## Goal
Convert the homepage hero from a split (text left / canvas right) into a **full-bleed immersive 3D hero**: the canvas fills the entire hero (edge to edge), text sits on top of it, and a left→right gradient scrim keeps text fully legible while the right side of the scene stays vivid.

## Changes

### 1. `src/routes/index.tsx` — hero section layout
- Add `bg-[#04131F]` to the hero section so the full-bleed navy backdrop matches the scene.
- Remove the current right-side 55%-wide canvas container and the desktop right-column spacer.
- Insert new full-bleed layers behind the text (desktop `lg:` only, keep mobile untouched):
  1. Ambient radial background (existing mesh gradient, kept).
  2. `<HeroCanvas className="absolute inset-0 hidden lg:block" />` filling the whole hero.
  3. Gradient scrim `absolute inset-0 hidden lg:block pointer-events-none` with `background: linear-gradient(90deg,#04131F 0%,rgba(4,19,31,0.94) 26%,rgba(4,19,31,0.55) 46%,rgba(4,19,31,0.1) 64%,transparent 78%)` and z-index below text but above canvas.
- Text column keeps `z-20` and its current copy/CTAs/trust chips — unchanged content.
- Collapse the grid to a single centered/left-aligned column on desktop (`max-w-[600px]`) so text stays in the left 45–50% naturally over the scrim.
- Mobile/tablet behavior unchanged: no 3D canvas (per earlier decision), text only.

### 2. `src/components/gtp/HeroConstellation.tsx` — brighter scene + reframe for full-bleed
- Move the composition so the core sits on the right side of the screen (shift `corePos` right, e.g. `(2.4, 0, -0.4)`) and card + nodes fan out around it, matching the reference file.
- Node base positions updated to the reference layout (Wallets top-right, Acceptance bottom-right, Payouts top-center, Collections bottom-center).
- Increase brightness/vividness:
  - Core glow sprite opacity `1.0`, scale `4.8`.
  - Core wireframe opacity `0.4`.
  - Rail line opacity `0.34`; rail pulse sprite scale `0.55`, opacity range `0.4 → 0.95`.
  - Node card border opacity `0.7`, shadow blur `44`.
  - Card texture: neon stroke opacity `0.95`, shadow blur `80`.
- Responsive reframe inside `Scene`: on resize, if `viewport.width < ~1100px equivalent`, scale group to `0.82` and shift `group.position.x = -0.4` so nothing clips at the right edge. Implement via `useThree().size` and update in a `useEffect`.
- Keep all existing guardrails: reduced-motion static frame, dpr `[1,2]`, particle cap (bump desktop back to `~170`), textures ≤1024px, `frameloop` gated by `active`.
- Re-add the `VIRTUAL` label? No — user already asked to remove it; keep removed.

### 3. `src/components/gtp/HeroCanvas.tsx` (only if needed)
- Verify the wrapper still lazy-loads `HeroConstellation`, honors `IntersectionObserver` pause, WebGL fallback, and `prefers-reduced-motion`. No behavior change expected; only confirm it renders full-bleed (no internal max-width).

## Out of scope
- No changes to nav, stats, products, or any section below the hero.
- No new dependencies.
- Mobile/tablet still hide the 3D scene entirely (as previously decided).

## Verification
- Playwright at 1440×900: canvas fills hero edge-to-edge; text remains crisp over the left ~50% (scrim covers it); core/card/nodes visible on the right, no right-edge clipping.
- Playwright at 1100×800: group scales down, all four nodes fully visible.
- Playwright at 820×1180 and 390×842: no canvas rendered; text-only hero.
- `bun run build` passes.
