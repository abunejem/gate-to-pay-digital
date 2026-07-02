## Mega-menu polish: label wrapping + overflow

**Files:** `src/components/gtp/MegaMenu.tsx`, `src/components/gtp/StickyNav.tsx`

### 1. Labels wrap, not truncate

In `ItemRow` (MegaMenu.tsx):
- Remove `truncate` from the label span — allow it to wrap to a second line naturally.
- Keep `truncate` on the description span (one-line clamp).
- Add a consistent `min-h-[52px]` to the row `<a>` so single-line and two-line rows share the same height and the grid stays even.
- Keep `items-start` so the icon square stays top-aligned when the label wraps.

### 2. Panel never clips the viewport

The panel currently uses `absolute start-0` with a hard `width={NNN}` from each MegaMenu call — a 1180px Solutions panel opened from a trigger near the left of `max-w-7xl` still fits within the container, but on a 1052px viewport it overflows the window because the container itself is narrower than 1180.

Fixes in MegaMenu.tsx:
- Cap panel width to the viewport with padding: `inlineSize: min(<width>px, calc(100vw - 32px))`.
- Change positioning so wide panels don't hug the trigger's left edge. Instead of `start-0`, center the panel under its trigger and clamp it into the viewport with CSS transforms: wrap the panel in a container that uses `left: 50%; transform: translateX(-50%)`, then clamp with `max-width: calc(100vw - 32px)`. This keeps narrow panels (Products, Who-it's-for) visually anchored under the trigger while wide panels (Solutions, Platform) stay on-screen.
- Alternative if centering under trigger looks off for the leftmost items: right-align the panel (`end-0` equivalent) when a `align="end"` prop is passed. Cleaner to just always center + clamp; will pick centered clamp as default and confirm visually.

### 3. Featured panel: fixed narrower width, prioritise columns

In MegaMenu.tsx, change the outer grid from `md:grid-cols-[1fr_260px]` to `md:grid-cols-[minmax(0,1fr)_240px]` so the columns side always shrinks first and gets `min-width: 0` (fixing sub-grid overflow that also contributes to clipping).

In StickyNav.tsx:
- Solutions: drop `width={1180}` to `width={980}` and **remove the `featured` panel** — 4 columns is the priority, and this alone solves the right-edge clipping.
- Platform: keep `width={960}` and `featured` (3 columns + featured fits comfortably).
- Products (`width={880}`) and Who-it's-for (`width={880}`) — unchanged.

### Result
- All item labels render in full, wrapping to a second line when needed, on aligned rows.
- No mega-menu clips the viewport at 1024–1280px widths.
- Solutions shows 4 clean groups; Platform and Products keep their featured panels.
