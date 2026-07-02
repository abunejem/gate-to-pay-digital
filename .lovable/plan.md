## Problem

`StickyNav` hides the entire `<nav>` at `<lg` (`hidden lg:flex`) and there is no hamburger / mobile drawer fallback. On mobile only the logo, theme toggle and "Get started" button remain — main navigation is gone.

## Fix

Add a mobile navigation affordance in `src/components/gtp/StickyNav.tsx` only (no changes to `MegaMenu`, desktop behavior untouched).

1. **Hamburger button** — visible `lg:hidden`, placed just before the CTA cluster (or after Logo). Uses `Menu` / `X` lucide icons, toggles an `open` state, `aria-expanded`, `aria-controls`.

2. **Mobile drawer panel** — rendered `lg:hidden`, anchored below the header (`absolute top-16 inset-x-0`), full-width, `glass` background, border-b, max-height with `overflow-y-auto`, closes on link click / Escape / route change.

3. **Content** — reuse the same data already defined inline for the four mega menus plus the three plain links (Developers, Company, Pricing). Render as a simple accordion:
   - Top-level: Products / Solutions / Platform / Who it's for (collapsible), then Developers / Company / Pricing (flat links), then Sign in.
   - Expanded section shows column headings and item labels as a flat vertical list (no featured card on mobile — keeps it lean).
   - Uses native `<details><summary>` for accordion to avoid new dependencies.

4. **Body scroll lock** while open; close on `Escape`.

5. Keep desktop markup and `MegaMenu` usage exactly as-is.

## Out of scope

- No changes to `MegaMenu.tsx`, routes, or i18n keys (reuses existing `t("nav.*")` strings).
- No new packages.
