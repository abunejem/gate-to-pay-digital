## Light-mode design fixes

Four contrast problems appear only in light mode, all caused by dark-navy foreground tokens sitting on top of hard-coded dark surfaces (hero, story, success story).

### 1. Sticky nav becomes invisible over dark sections

`StickyNav` uses `text-foreground/85` (dark navy in light mode) and the `glass` utility (nearly transparent in light mode). Over the dark hero (`#04131F`), dark story section (`#022A44`), and success story block, the nav links and Client Login read as dark-on-dark.

**Fix (`src/components/gtp/StickyNav.tsx`):** replace the `glass` class in the header wrapper with a background that stays legible in both themes:
- scrolled: `bg-background/85 backdrop-blur-xl border-b border-border`
- top:      `bg-background/55 backdrop-blur-md border-b border-transparent`

Because `--background` is white in light mode and `#04131F` in dark mode, the nav becomes a readable band over any section in either theme without leaking the underlying dark surface through.

### 2. Hero "Explore the platform" ghost button is invisible

`Button` `variant="ghost"` uses `text-foreground` + `border-border`, both dark in light mode. On the desktop dark hero it disappears.

**Fix (`src/routes/index.tsx`, line 131):** add desktop-only overrides so it reads as a light outlined button over the dark hero:
```
className="w-full sm:w-auto lg:text-white lg:border-white/30 lg:hover:bg-white/10 lg:hover:border-white/50"
```

### 3. Hero TrustBar pills have unreadable text

Default `Pill` tone uses `text-foreground` + light `border-border` + faint `bg-glass`. Over the dark desktop hero, the label text is dark-on-dark.

**Fix (`src/routes/index.tsx`, line 135):** pass a className to `TrustBar` and forward it to each `Pill` (small change in `TrustBar.tsx` to accept and spread a `pillClassName`), applying `lg:text-white/90 lg:border-white/25 lg:bg-white/[0.06]` so pills switch to on-dark styling only on the desktop hero.

### 4. Client logo strip is barely visible in light mode

Logos use `text-muted-foreground` (light gray `#606161`) with `grayscale opacity-60` on a white background → almost invisible.

**Fix (`src/components/gtp/ClientLogoStrip.tsx`):** raise the resting state to `opacity-80` and swap `text-muted-foreground` for `text-foreground/70`, keeping hover at full opacity/primary. Same feel in dark mode, materially more legible in light.

### Verification

Playwright at 1280×1800 in light mode, capturing:
- top of page (hero + nav readability, ghost CTA, trust pills)
- stats + logo strip
- StoryScroll dark section with nav scrolled over it
- Success story dark card with nav scrolled over it

Confirm dark mode remains visually unchanged in the same viewports.

### Out of scope

No token changes to `--foreground`, `--muted-foreground`, `--glass`, or the story/success dark surfaces. Hero 3D scene, layout, and copy stay as-is.
