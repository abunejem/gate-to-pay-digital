## Anchor mega-menu panels under their triggers

**File:** `src/components/gtp/MegaMenu.tsx`

### Problem

Current positioner centers the panel under the trigger and clamps into the viewport, so wide panels (Solutions, Platform) end up shifted left across the whole nav and look disconnected from the trigger that opened them. Narrow panels still fit but the alignment is inconsistent.

### Fix — start-align + viewport clamp

Replace the "center under trigger" logic with "start-align under trigger, then clamp to viewport":

1. Anchor position: default `left = triggerRect.left` (start edge of trigger). This visually connects the panel to the item that opened it.
2. Clamp: if `left + panelWidth > viewportWidth - 16`, shift left so `left = viewportWidth - 16 - panelWidth`. Never go below `left = 16`.
3. Apply as `translateX(desiredLeft - wrapRect.left)` on the absolutely-positioned panel (same mechanism as today), replacing the current centered formula.
4. Recompute on `open` and on `resize` (already wired).

### Keep

- `top-full pt-3` spacing gives the small gap from the top bar — keep as-is.
- `inlineSize: min(${width}px, calc(100vw - 32px))` — keep, so a panel never exceeds the viewport.
- Row label wrapping and `min-h-[52px]` even row heights — unchanged.
- Featured column `240px` with `minmax(0,1fr)` for item columns — unchanged.

### Per-menu widths (StickyNav.tsx)

Right-size each panel to its content so it hugs its columns rather than spreading:

- Products: `width={720}` (2 columns + featured 240 = ~720)
- Solutions: `width={880}` (4 columns of ~160 each, no featured — already dropped)
- Platform: `width={860}` (3 columns + featured)
- Who it's for: `width={640}` (1 column + featured)

### Result

Each dropdown opens directly under its trigger, sized to its content. Wide panels only shift left when they would otherwise clip the viewport's right edge, and never further than needed.
