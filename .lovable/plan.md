## Restore scrollytelling, swap SVG visuals for the uploaded images

Revert to the original `StoryScroll` scroll-pinned structure. Only the right-column visual per step changes: use the three uploaded photos (challenge / platform / result) with the neon navy treatment, instead of the abstract SVG clusters.

### 1. Recreate `src/components/gtp/StoryScroll.tsx`

Same behavior as before:
- Section pins for `steps.length * 100vh`, sticky inner at `top-0 h-screen`, left column = heading + progress bars, right column = crossfading step content.
- Mobile / reduced-motion fallback = static 3-card grid.
- Scroll listener sets `active` index by section progress.

New `StoryStep` shape:
```ts
interface StoryStep {
  eyebrow: string;
  title: string;
  body: string;
  image: { url: string };
  imageAlt: string;
  overlayStat?: { label: string };
}
```

Right column per step renders an image card (replaces `StoryVisual`):
- `relative rounded-[16px] overflow-hidden border border-primary/25`
- `boxShadow: 0 0 0 1px rgba(34,227,255,0.15), 0 0 60px -10px rgba(34,227,255,0.35), inset 0 0 40px rgba(34,227,255,0.08)`
- `<img>` with `aspect-[4/3] object-cover w-full`, `loading="lazy" decoding="async"`
- Optional glass overlay bottom-left: `backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-body-sm text-white`

Layout inside sticky area: `grid md:grid-cols-[1fr_1.2fr] gap-12 items-center`, text (pill + h2 + body) on the left/top of the right column, image below or beside text — keep the desktop layout matching the original (text + image both in right column, image under text) so the crossfade still works. Concretely: each step's absolute-positioned div contains `Pill`, `h3`, `p`, then the image card, all vertically centered via `flex flex-col justify-center` inside a `min-h-[520px]` right column.

Mobile fallback card gets image below text with same neon treatment (smaller: `aspect-[4/3]`).

### 2. Update `src/routes/index.tsx`

- Swap `StoryImageRows` import for `StoryScroll` import (keep the three asset JSON imports as-is).
- Rename `STORY_ROWS` → `STORY_STEPS` (data is identical shape — the same three objects).
- Replace the section with:
  ```tsx
  <StoryScroll
    heading="As you scale, money gets complicated. We make it simple."
    steps={STORY_STEPS}
  />
  ```

### 3. Cleanup

Delete `src/components/gtp/StoryImageRows.tsx`.

### Verification

- Typecheck.
- Playwright at 1280×1800: scroll through the pinned section, screenshot at ~25/50/75% progress to confirm each step's image crossfades in with neon border + optional glass stat.
- 390×844: confirm the mobile 3-card fallback shows each image below its text.

### Out of scope
- No changes to intro copy, other sections, or design tokens.
- No new assets — reuse the three already uploaded.
