# Gate to Pay — Foundation & Component Library (v2)

Scope: design system, theming, i18n scaffold, brand assets, reusable component library. No marketing pages yet.

## 1. SSR / prerender

TanStack Start SSR stays on; all text renders server-side into initial HTML.

## 2. Brand assets

- Add `logo-horizontal.svg` (has gray text — for **light** theme), `logo-vertical.svg`, `logo-icon.svg` to `src/assets/`.
- Create a **dark-theme logo variant** with white text (`#EAF6FA`) by editing a copy of `logo-horizontal.svg` — swap `.st0 { fill: #606161 }` for white. Saved as `logo-horizontal-dark.svg`.
- `<Logo />` component picks the correct variant from `useTheme()`.
- Favicon: `public/favicon.svg` (from `logo-icon.svg`) **and** `public/favicon-32.png` fallback (generated via imagegen or rasterized). Delete default `public/favicon.ico`. Wire both `<link rel="icon">` entries in `__root.tsx`.
- Root `head()` gets real Gate to Pay title/description/OG tags.

## 3. Design tokens (`src/styles.css`)

Same token spec as approved plan (brand constants, dark "neon" palette, light palette, 16/8/pill radii, `--glow`), registered via `@theme inline`. `@custom-variant dark (&:is(.dark *))`.

**Scoped reduced-motion rule:** kill large motion only.

```css
@media (prefers-reduced-motion: reduce) {
  .motion-parallax, .motion-marquee, .motion-countup,
  .motion-gradient-mesh, .motion-reveal {
    animation: none !important;
    transform: none !important;
    transition: none !important;
  }
}
```

Subtle opacity/color transitions and focus/hover feedback remain on. Motion components opt in by adding the appropriate class.

## 4. Typography

Font stack `-apple-system, "SF Pro Display", "SF Pro Text", Inter, sans-serif`. Load Inter via `<link>` in `__root.tsx`. Size tokens: display 56, h1 44, h2 34, h3 24, body 16–18. `letter-spacing: -1px` on display/h1.

## 5. Theme system — three-state (light / dark / system), default = system

Data model:
- `storedPreference: "light" | "dark" | "system" | null` in `localStorage["gtp-theme"]`.
- `resolvedTheme: "light" | "dark"` — what actually renders.
- If `storedPreference` is `null` or `"system"`, resolve from `matchMedia("(prefers-color-scheme: dark)")`.

**Pre-hydration inline script** (in `__root.tsx` via `scripts` in `head()` so it runs before paint):

```js
(function(){
  try {
    var s = localStorage.getItem("gtp-theme");
    var isDark = s === "dark" || ((s === null || s === "system") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.dataset.themePref = s || "system";
  } catch(e){}
})();
```

`<html suppressHydrationWarning>` stays.

`ThemeProvider` (`src/lib/theme.tsx`):
- Reads initial state from `document.documentElement`.
- Exposes `{ preference, resolvedTheme, setPreference }`.
- Subscribes to `matchMedia("(prefers-color-scheme: dark)").change` **only while `preference === "system"`**; live-updates `resolvedTheme` and the `.dark` class.
- `setPreference("light" | "dark" | "system")` writes to localStorage (or removes on `"system"` — TBD, we'll store `"system"` explicitly for clarity) and updates the class.

`<ThemeToggle />`: three-state segmented control (Sun / Moon / Monitor icons), accessible via radio group semantics, keyboard operable. Current preference highlighted.

## 6. i18n scaffold

`src/lib/i18n/` with `en.ts` dictionary, `LocaleProvider`, `t(key)` hook. `<html lang="en" dir="ltr">` now, swappable to `"ar"/"rtl"` later. All copy through `t()`. Components use logical CSS properties only (`margin-inline`, `padding-inline`, `inset-inline-*`, `text-start`, `border-inline-*`) — no directional Tailwind utilities in `src/components/gtp/`.

## 7. Reusable component library (`src/components/gtp/`)

1. `Button` — `primary` (fill `#22E3FF`, text `#04131F` navy for AA contrast on neon, `box-shadow: var(--glow)` in dark; solid teal `#0A8AA9` with white text in light), `ghost`, `secondary`. 8px radius.
2. `BentoTile` — glass bg (dark), 16px radius, hover lift + neon edge (dark) / soft shadow (light).
3. `StatCard` — `useCountUp` gated by `useInView` and reduced-motion (renders final value instantly if reduced); primary-colored number glows in dark. Uses `.motion-countup` class.
4. `StickyNav` — glass sticky, transparent over hero → solid on scroll (rAF scroll listener), houses Logo, links, MegaMenu, ThemeToggle, CTA.
5. `MegaMenu` — hover/focus multi-column dropdown, keyboard accessible, uses BentoTiles.
6. `TrustBar` — compliance badges (CBJ Licensed, Mastercard Principal, Visa, UnionPay) as pills.
7. `ClientLogoStrip` — grayscale→color on hover; marquee uses `.motion-marquee` (paused under reduced-motion).
8. `ApiResponseCard` — `shiki`-highlighted JSON/HTTP, pre-rendered on the server so code ships in initial HTML; dual light/dark themes.
9. `FaqAccordion` — restyled shadcn Accordion.
10. `PricingTable` — tabbed plans + JOD/USD toggle.
11. `Footer` — logo, columns, region/compliance line, social.
12. Primitives: `GlassPanel`, `Pill`, `Logo`.
13. **`Reveal`** (new) — wraps children with `IntersectionObserver`-driven fade/slide-in via `useInView` hook. Adds `.motion-reveal` class so reduced-motion disables it and renders content in final state. Props: `as`, `delay`, `direction` (`up`/`fade`), `once` (default true). `useInView(ref, { rootMargin, once })` exported separately for `StatCard` and future use.

## 8. Contrast confirmation

- Primary button: `#22E3FF` bg + `#04131F` text → contrast ratio ~14.5:1 ✅ AA/AAA.
- Neon `#22E3FF` **text** on `#04131F` bg → ~14.5:1 ✅ AA. Reserved for large stat numbers/CTAs, not body copy.
- Body text `#EAF6FA` on `#04131F` → ~17:1 ✅ AAA.
- Dim `#8FB2C2` on `#04131F` → ~9:1 ✅ AA — safe for secondary text.
- Light theme: `#022A44` headings on `#FFFFFF` → ~15:1 ✅; `#2A3B44` body on `#FFFFFF` → ~12:1 ✅.

## 9. Component showcase route

`src/routes/index.tsx` becomes an internal showcase rendering every component in both themes with labeled sections, so we can QA before pages exist. Full `head()` metadata for Gate to Pay.

## 10. Not in this step

Marketing pages (Home, Products, Solutions, Developers, Company, Pricing, Contact), real copy, backend/forms.

---

## Technical notes

- Tailwind v4 CSS-first; no `tailwind.config.js`.
- Semantic tokens only in components.
- `bun add shiki`.
- Motion opt-in via `.motion-*` classes; reduced-motion strips only those.
- Theme init script is tiny and inline; `<html suppressHydrationWarning>`.
- Logical CSS properties enforced in `src/components/gtp/`.
