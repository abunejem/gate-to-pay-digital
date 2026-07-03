## Rebuild story section as image-led alternating rows

Replace the current `StoryScroll` scrollytelling with three image+text rows on the same navy canvas.

### 1. Upload the three images as Lovable Assets

Use `lovable-assets create` from `/mnt/user-uploads/challeng.png`, `platform.png`, `result.png` → pointer JSON at:
- `src/assets/story-challenge.png.asset.json`
- `src/assets/story-platform.png.asset.json`
- `src/assets/story-result.png.asset.json`

(Keep PNG; browsers cache via CDN. Skip WebP conversion — source is PNG and re-encoding needs a build step we don't have. Add `loading="lazy"` + `decoding="async"`.)

### 2. New component: `src/components/gtp/StoryImageRows.tsx`

Props:
```ts
interface StoryRow {
  eyebrow: string;
  title: string;
  body: string;
  image: { url: string };
  imageAlt: string;
  overlayStat?: { label: string };
}
interface Props { intro: string; rows: StoryRow[]; }
```

Layout:
- Section: `bg-[var(--color-story)]`, `text-[var(--color-story-foreground)]`, `py-24 sm:py-32`, container `max-w-6xl`.
- Intro line as centered `text-h2` above rows, `mb-20`.
- Each row: `grid md:grid-cols-2 gap-12 lg:gap-20 items-center` with `mt-24 first:mt-0`. Even index → image left; odd → `md:[&>*:first-child]:order-2` (image right). Text column: `Pill` eyebrow, `text-h2` heading, `text-body-lg opacity-85` body, max-w-md.
- Image wrapper: `relative rounded-[16px] overflow-hidden` with neon treatment:
  - `border border-primary/25`
  - `shadow-[0_0_0_1px_rgba(34,227,255,0.15),0_0_60px_-10px_rgba(34,227,255,0.35),inset_0_0_40px_rgba(34,227,255,0.08)]`
  - `<img>` `w-full h-auto aspect-[3/2] object-cover` `loading="lazy" decoding="async"`
- Optional overlay glass card: absolute bottom-4 left-4, `backdrop-blur-md bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-body-sm`, shows `overlayStat.label`.
- Wrap each row in `<Reveal>` (existing component) for fade/slide-in; `Reveal` already respects reduced motion via `useInView`. Add `delay={i*80}`.

### 3. Wire in `src/routes/index.tsx`

- Remove `StoryScroll` import + JSX.
- Import `StoryImageRows` + the three asset JSONs.
- Replace with:

```tsx
<StoryImageRows
  intro="As you scale, money gets complicated. We make it simple."
  rows={[
    { eyebrow: "The challenge", title: "Growth multiplies complexity.", body: "...", image: challengeImg, imageAlt: "Tangled network of connections", overlayStat: { label: "Every rail. Every provider." } },
    { eyebrow: "The platform", title: "One regulated platform, every connection.", body: "...", image: platformImg, imageAlt: "Central hub with radiating connections", overlayStat: { label: "Real-time settlement" } },
    { eyebrow: "The result", title: "Scale, safely, without slowing down.", body: "...", image: resultImg, imageAlt: "Ascending performance bars" },
  ]}
/>
```

- Remove `STORY_STEPS` constant.

### 4. Cleanup

Delete `src/components/gtp/StoryScroll.tsx` (no other consumers per codebase scan).

### Verification

- `curl` `/` and confirm three `<img>` tags with the CDN URLs, alt text, and intro line present in SSR HTML.
- Playwright at 1280×1800 and 390×844: screenshot the section to confirm alternating layout, neon border visible, no dead space, images render.
- Typecheck.

### Out of scope

- No changes to nav, hero, or other sections.
- No new design tokens (reuse `--color-story`, `--color-primary`).
- No WebP conversion pipeline.
