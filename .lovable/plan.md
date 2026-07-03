## Goal

Make the site feel native on mobile and lock in "mobile-first" as a permanent project rule so every future change respects it.

## 1. Persistent rule (memory)

Add a Core rule at `mem://index.md`: **"Mobile-first: every screen, section, and component must render and behave correctly at 375px width first, then scale up. Verify mobile before shipping."** Referenced by future turns automatically.

## 2. StickyNav polish (`src/components/gtp/StickyNav.tsx`)

- Tighten header at small widths: `h-14 sm:h-16`, `px-4 sm:px-6`, `gap-2 sm:gap-4`. Match the mobile drawer's `top-*` and `max-h-*` to the new header height.
- Shrink CTA on mobile: `Get started` uses shorter label or `size="sm"` already — reduce its horizontal padding on `<sm` and hide `Sign in` link (already hidden `<sm`).
- Hide `ThemeToggle` inside the mobile drawer only (`hidden sm:inline-flex` in header, add a row inside the drawer) so the header row fits on 360px screens.
- Ensure the drawer closes on route change / outside click (backdrop) in addition to Escape.

## 3. Homepage mobile pass (`src/routes/index.tsx`)

Reduce vertical rhythm and oversized paddings on `<md`. Every section currently uses `py-16` / `py-20` / `py-24` — halve them on mobile:

- Hero: `pt-20 pb-24` → `pt-12 pb-16 sm:pt-20 sm:pb-24`. CTA buttons stack full-width on `<sm` (`w-full sm:w-auto`).
- Stats / Products / Story diagram / Who / Why / Success / Developer / Final CTA sections: `py-16|20|24` → `py-12 sm:py-16` (or `sm:py-20|24`).
- Success story card: `p-10 md:p-14` → `p-6 sm:p-10 md:p-14`; `rounded-card` stays.
- Developer teaser grid: already `lg:grid-cols-2`; ensure the `ApiResponseCard` doesn't blow the viewport — it already has `overflow-x-auto` on `<pre>`, keep.
- Bento grids: already responsive; no change.

## 4. StoryScroll on mobile (`src/components/gtp/StoryScroll.tsx`)

The scrollytelling variant uses `min-h={steps*100vh}` + sticky `h-screen` two-column layout. On phones this is tall, cramped, and the right column overlaps. Fix:

- Below `md`, render the reduced-motion / static variant unconditionally (3 stacked cards). Keep scrollytelling only at `md+`.
- Inside scrollytelling, `md:grid-cols-[1fr_1.2fr]` already gates the two-column layout, but the sticky wrapper still enforces `h-screen` on mobile → forcing static below `md` avoids all of it.

## 5. MoneyFlowDiagram on mobile (`src/components/gtp/MoneyFlowDiagram.tsx`)

The 800×380 viewBox scales down but the 10–14px text becomes unreadable. Bump SVG text sizes (e.g. `fontSize="18"` for rail labels, `16` for hub subtitle, `20` for "GATE TO PAY", `18` for "Your product") — SVG scales all of it uniformly so desktop still looks proportional; on mobile the text stops being sub-legible.

## 6. Footer (`src/components/gtp/Footer.tsx`)

- `md:grid-cols-6` with brand at `md:col-span-2` → on mobile columns stack full-width, but the four link columns collapse into a single-column list which is very tall. Use `grid-cols-2 md:grid-cols-6` so link groups stack in a 2-col mobile grid.
- Bottom row: keep `flex-wrap`; add `text-center md:text-start` for the two spans.

## 7. Typography scale

Current `text-display` mins at 40px, `text-h1` at 32px — fine. `text-h3` is fixed 24px; leave as-is. No change unless something visibly breaks after (1)–(6).

## Out of scope

- No new routes, no copy changes, no new components, no palette changes.
- No changes to `MegaMenu` (desktop-only).
- No visual redesign — this is a fit/scale pass.

## Verification

After edits, use Playwright at `viewport={"width": 390, "height": 844}` to screenshot the homepage top, bento, story, diagram, footer, and drawer-open state; view each shot and confirm nothing overflows, text is legible, and paddings look intentional.
