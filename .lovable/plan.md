# Success Story Carousel

Replace the single featured story block in `src/routes/index.tsx` (lines 258–281) with a new `SuccessStoryCarousel` component. Keep the existing neon/story tokens (`--color-story`, `--color-story-foreground`) and section rhythm.

## New component: `src/components/gtp/SuccessStoryCarousel.tsx`

Props:
```ts
type Slide = {
  id: string;
  eyebrow: string;             // "Live in production · <Solution>"
  title: string;
  body: string;
  metric?: { value: string; label: string };
  logo?: { src: string; alt: string };
  href: string;                // "Read the story" link
  sample?: boolean;            // renders a small "sample — to verify" tag
};
```

### Rendering (SSR-first, crawlable)
- Root: `<section aria-roledescription="carousel" aria-label="Customer success stories">`.
- Track: horizontal flex row, `scroll-snap-type: x mandatory`, `overflow-x-auto`, one slide per viewport (`min-w-full`, `snap-center`). Each slide is `role="group" aria-roledescription="slide" aria-label="{n} of {total}: {title}"`.
- All slides present in the initial HTML so search/social crawlers see every story. No `display:none` gating.
- Slide card reuses the existing `rounded-card` treatment on `var(--color-story)` with `Pill` for the eyebrow, `text-h2` title, `text-body-lg` body, optional metric block (large number + small label), optional logo (right side on desktop, above title on mobile), and `Button variant="primary"` CTA with `ArrowRight`.

### Enhancement (JS)
- Prev/next arrow buttons (icon buttons with `aria-label="Previous story" / "Next story"`, disabled state at ends when not looping).
- Dot indicators: `role="tablist"`; each dot is a `button` with `aria-label="Go to slide N"` and `aria-current="true"` on active.
- Keyboard: ArrowLeft/ArrowRight on the carousel region change slide; Tab moves through arrows, dots, then CTA of the active slide.
- Swipe on mobile via native scroll-snap; active slide tracked with `IntersectionObserver` on each slide.
- Programmatic navigation uses `track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })`.
- Auto-advance: 6s interval, loops. Pauses on `pointerenter`, `focusin`, when `document.hidden`, or when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` (in which case never starts).
- No layout shift before hydration — pre-JS the track is a horizontal scroller users can already swipe; arrows/dots render only after mount (or render always and remain harmless without JS).

### Styling
- Container: `mx-auto max-w-6xl` inside the existing section wrapper.
- Arrows: circular, `border border-border/40`, positioned outside the card on desktop (`lg:-left-14 / lg:-right-14`), inside on mobile.
- Dots: 8px circles, active = 24px pill, using `--color-story-foreground` at 100% / 40% opacity.
- Sample tag: small uppercase `Pill` variant reading `sample — to verify` in the top-right of placeholder slides.

## Slide data (defined in `src/routes/index.tsx`)

1. Pharma (real, unchanged copy) — eyebrow "Live in production · Supply Chain Payments", metric optional (omit for now), href `#`.
2. Trading platform (sample) — "Live in production · Trading & Payouts", headline about instant client withdrawals & affiliate payouts across 17+ countries.
3. Retail chain (sample) — "Live in production · Omnichannel Acceptance", one acceptance layer across POS + online, settled in one place.
4. Delivery platform (sample) — "Live in production · Fleet Funding", just-in-time courier card funding, no idle float.
5. Youth club / association (sample) — "Live in production · Member Wallets", member wallets, digital dues, benefit distribution.

Placeholder slides get `sample: true`, no logo, and a plausible sample metric (e.g. "17+ countries", "1 settlement file", "0 idle float", "1-tap dues"). CTAs point to `#` for now.

## Integration
- Replace lines 258–281 with:
  ```tsx
  <section className="px-4 sm:px-6 py-14 sm:py-20 border-t border-border">
    <div className="mx-auto max-w-6xl">
      <Reveal>
        <SuccessStoryCarousel slides={SUCCESS_STORIES} />
      </Reveal>
    </div>
  </section>
  ```
- Add `SUCCESS_STORIES` constant near the other data constants at the top of the file.

## Out of scope
- No routing to real case-study pages (CTA hrefs stay `#`).
- No new design tokens; reuse existing story palette.
- No changes to `StoryScroll` or other sections.

## Verification
- Playwright at 1280×1800 and 390×844: screenshots of slide 1, after clicking next twice, after pressing ArrowRight, and hover-pause behavior confirmed via console log of the interval state. Confirm all 5 slides exist in the initial SSR HTML via `curl` of `/` and `rg "sample — to verify"`.
