## Two polish fixes

### 1. Section headings clipped behind the sticky nav

The sticky header is 56–64px tall (`h-14 sm:h-16`) and sits over every section. When a user lands on `#anchor` or scrolls near a section, the heading currently ends up under the nav (e.g. "One integration. Every rail." is partially hidden).

**Fix (global, `src/styles.css`):** add a base rule so every section, h1, and h2 gets a `scroll-margin-top` matching the nav height:

```css
@layer base {
  section, h1, h2 { scroll-margin-top: 96px; }
}
```

**Fix (per-section top padding, `src/routes/index.tsx`):** bump the vertical padding on the marquee-adjacent sections that currently read as tight against the nav on shorter viewports:

- Multi-rail signature section (`py-16 sm:py-24` → `pt-24 sm:pt-28 pb-16 sm:pb-24`)

No other section changes; the standard `py-14 sm:py-20` already breathes enough once `scroll-margin-top` is in place.

### 2. StoryScroll right column: center content + supporting visual per step

`src/components/gtp/StoryScroll.tsx`

The right column has `min-h-[280px]` and text pinned to the top, so most of the viewport below the paragraph is empty. Two changes:

**a. Vertical centering.** Change the right column wrapper to a flex column centered vertically, and the outer grid already has `items-center`. Replace the fixed `min-h-[280px]` container with a full-height stack that centers its active step:

```tsx
<div className="relative h-full min-h-[420px] flex items-center">
  {steps.map((s, i) => (
    <div ... className="absolute inset-0 flex flex-col justify-center">
      <Pill .../> <h3 .../> <p .../>
      <StoryVisual kind={s.visual} className="mt-8" />
    </div>
  ))}
</div>
```

**b. Supporting visual per step.** Add an optional `visual` field to the `StoryStep` interface (`"challenge" | "platform" | "result"`) and render a small inline SVG cluster underneath the paragraph:

- **The challenge** — a tangled node cluster: 5 small circles connected by overlapping curved strokes in muted white, conveying "many rails, tangled".
- **The platform** — a single primary-tinted hub circle with 4 clean radial lines out to small nodes (mini version of the multi-rail diagram, roughly 280×140).
- **The result** — four aligned bars ascending left-to-right with a subtle primary underline, conveying "scale, safely".

All three visuals share:
- ~280px wide × 120–140px tall
- stroke `var(--color-story-foreground)` at opacity 0.35, primary accent for the active nodes
- pure static SVG (no animation) so reduced-motion is unaffected
- rendered inline in `StoryScroll.tsx` as a small `StoryVisual` helper component (no new file)

Wire the `STORY_STEPS` array in `src/routes/index.tsx` to pass `visual: "challenge" | "platform" | "result"` for the three existing steps.

### Verification

Playwright at 1280×1800 (light + dark):
- scroll to Multi-rail section — confirm "One integration. Every rail." heading is fully visible below the nav
- scroll through StoryScroll — confirm each of the three steps is vertically centered and shows its supporting visual, with no empty column below the text

### Out of scope

No copy changes, no changes to the mobile fallback layout of StoryScroll (it already stacks cards), no changes to StickyNav height or behavior.
