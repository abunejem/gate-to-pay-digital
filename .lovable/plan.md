## Goal

Rebuild the homepage hero as a split layout with an R3F "constellation" visual behind/beside the existing text, matching `hero-3d-constellation.html` in composition, colors, and motion — while keeping the text SSR'd, the canvas lazy/decorative, and mobile fully covered.

## 1. Dependencies

Install: `three`, `@react-three/fiber`, `@react-three/drei`. Nothing else added.

## 2. New file: `src/components/gtp/HeroCanvas.tsx` (wrapper — cheap, ships in main bundle)

Responsibilities — no Three.js imports here:
- Client-only mount gate (`useEffect` → `mounted=true`); returns `<StaticFallback/>` during SSR and until mounted.
- WebGL detection (`canvas.getContext('webgl2') || getContext('webgl')`); if unsupported, keeps `<StaticFallback/>`.
- `IntersectionObserver` on the wrapper div → `active` state (rootMargin `200px`).
- `useReducedMotion` hook using `matchMedia('(prefers-reduced-motion: reduce)')`.
- Uses `React.lazy(() => import('./HeroConstellation'))` inside `<Suspense fallback={<StaticFallback/>}>` so the 3D chunk is off the critical path.
- Passes `{ active, reduced, variant }` where `variant = window.innerWidth < 1024 ? 'mobile' : 'desktop'`.
- Renders `pointer-events-none absolute inset-0` so text below stays clickable.

`StaticFallback` is a pure-CSS/SVG panel: two radial gradients (matching the ref's `hero-bg` — `radial-gradient(1000px 600px at 72% 40%, rgba(34,227,255,.18), transparent 60%)` + the teal one) plus a faint centered SVG outline of the "core" ring. Never blank.

## 3. New file: `src/components/gtp/HeroConstellation.tsx` (lazy chunk — the R3F scene)

Top-level `<Canvas>` config:
- `dpr={[1, 2]}`, `gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}`, `camera={{ fov: 44, position: [0, 0, 10], near: 0.1, far: 100 }}`.
- `frameloop={active && !reduced ? 'always' : 'demand'}`.
- On `reduced`, a `useEffect` calls `invalidate()` once after mount so the static frame paints.

Shared textures (built once with `useMemo`, size ≤ 1024):
- `glowTex` — 128×128 canvas radial gradient (identical stops to reference).
- `cardTex` — 1024×648 canvas: rounded-rect base (`#072a3a`) with cyan shadow, teal→navy linear-gradient fill, diagonal cyan sheen, neon stroke, chip rect, "Gate to Pay" right-aligned, `5241  ••••  ••••  4242` monospace, "CARDHOLDER" and "VIRTUAL" — copied 1:1 from the ref's `cardTex()`.
- `nodeTex(label, drawIcon)` — 512×512 rounded glass panel + centered line-icon + label. Icons: `wallet`, `pos`, `bolt`, `split` (identical vector paths to the ref).

Scene graph inside `<Canvas>`:

```
<group ref=groupRef>            // gets mouse-parallax rotation
  <group position={[2.6, 0, -0.4]} ref=coreRef>   // Core
    <sprite scale={[4.2,4.2,1]}><spriteMaterial map={glowTex} blending=AdditiveBlending depthWrite={false} opacity={0.9}/></sprite>
    <mesh><sphereGeometry args={[0.55,32,32]}/><meshBasicMaterial color=0x0A8AA9 transparent opacity={0.9}/></mesh>
    <mesh ref=wireRef><sphereGeometry args={[0.78,20,20]}/><meshBasicMaterial color=0x22E3FF wireframe transparent opacity={0.35}/></mesh>
  </group>

  <mesh position={[-0.2,0.15,0.8]} rotation={[-0.12,-0.42,0.10]} ref=cardRef>
    <planeGeometry args={[3.5, 2.21]}/>
    <meshBasicMaterial map={cardTex} transparent/>
  </mesh>

  {nodes.map(n => <Node ...at position, with rail>)} // 4 desktop, 2 mobile (Wallets + Payouts)
  <Rails targets=[card, ...nodes]/>                   // CatmullRomCurve3 lines + traveling sprite pulses
</group>
<Particles count={variant==='mobile'?60:150}/>       // <points> with PointsMaterial neon size 0.05
```

Animation via a single `useFrame((state) => { ... })` mirroring the ref exactly:
- `mx += (tx - mx)*0.05; my += (ty - my)*0.05;` (targets updated from pointer events on the wrapper; skipped when `reduced`)
- `group.rotation.y = mx*0.45; group.rotation.x = my*0.3`
- Core: `scale = 1 + sin(t*1.6)*0.06`; wire `rotation.y = t*0.3; rotation.x = t*0.15`
- Card: `position.y = 0.15 + sin(t*0.6)*0.12; rotation.z = 0.10 + sin(t*0.4)*0.02`
- Each node: `position.y = base.y + sin(t*speed + i)*amp` with per-node amp/speed from ref
- Each rail pulse: `tt = (t*spd + phase) % 1; pulse.position = curve.getPointAt(tt); opacity = 0.4 + 0.5*sin(tt*π)`
- Particles: `points.rotation.y = t*0.02 + mx*0.15`

Rails use `<primitive object={new THREE.Line(geometry, material)} />` built in `useMemo` (or `<line>` intrinsic with `<bufferGeometry>` populated from `curve.getPoints(44)`). Each pulse is a `<sprite>` re-using `glowTex`, scale 0.5.

`reduced` variant: no `useFrame` body executes (early return); parallax listeners not attached; one paint on mount.

## 4. Homepage hero edit (`src/routes/index.tsx`)

Convert only the existing hero `<section>` — every text string, i18n key, `Reveal` wrapper, `Pill`, H1 markup, subtitle, `<Button>` pair, and `<TrustBar/>` stay byte-for-byte identical. Layout change:

```tsx
<section className="relative overflow-hidden px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
  {/* Ambient background gradients matching the reference hero-bg — kept when the canvas is not up */}
  <div className="pointer-events-none absolute inset-0 -z-10 opacity-70"
       style={{ background: "radial-gradient(1000px 600px at 72% 40%, rgba(34,227,255,0.18), transparent 60%), radial-gradient(700px 500px at 15% 80%, rgba(10,138,169,0.16), transparent 60%)" }}/>

  {/* Desktop: canvas covers full width and bleeds behind text. Mobile: sits as a 320px band below via lg:hidden variant */}
  <HeroCanvas className="hidden lg:block absolute inset-0" />

  <div className="relative mx-auto max-w-7xl grid gap-10 lg:grid-cols-[minmax(0,560px)_1fr] items-center">
    <div className="relative text-center lg:text-start">
      {/* Legibility scrim only on lg where canvas bleeds behind */}
      <div aria-hidden className="hidden lg:block absolute -inset-6 -z-10 bg-gradient-to-r from-background via-background/80 to-transparent rounded-3xl"/>
      {/* --- existing content, unchanged: --- */}
      <Reveal><Pill tone="primary" className="mb-6">{t("hero.eyebrow")}</Pill></Reveal>
      <Reveal delay={80}><h1 className="text-display font-semibold">{t("hero.h1Before")}<span className="text-primary dark:glow-text">{t("hero.h1Highlight")}</span>{t("hero.h1After")}</h1></Reveal>
      <Reveal delay={160}><p className="mx-auto lg:mx-0 mt-6 max-w-2xl text-body-lg text-muted-foreground">{t("hero.sub")}</p></Reveal>
      <Reveal delay={240}>
        <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3">
          <Button size="lg" className="w-full sm:w-auto">{t("hero.ctaPrimary")} <ArrowRight size={16}/></Button>
          <Button size="lg" variant="ghost" className="w-full sm:w-auto">{t("hero.ctaSecondary")}</Button>
        </div>
      </Reveal>
      <Reveal delay={320} className="mt-10"><TrustBar/></Reveal>
    </div>
    <div className="hidden lg:block h-[560px]"/>{/* reserves the right column so text doesn't jump when canvas mounts */}
  </div>

  {/* Mobile canvas: rendered as its own band below content (never overlapping text) */}
  <div className="lg:hidden mt-10 relative h-[320px] rounded-card overflow-hidden">
    <HeroCanvas className="absolute inset-0" />
  </div>
</section>
```

Only imports added to `index.tsx`: `HeroCanvas`. No other section touched.

## 5. Guardrails checklist (mapped to user requirements)

| Requirement | Implementation |
|---|---|
| Hero text SSR'd | Text is plain JSX in the route file — nothing lazy. |
| Canvas client-only + lazy | `mounted` gate + `React.lazy` inside wrapper. |
| WebGL fallback | `StaticFallback` (gradients + SVG ring) whenever detection fails. |
| Reduced motion | Single paint via `invalidate()`, `frameloop="demand"`, no pointer listeners. |
| dpr cap | `dpr={[1,2]}`. |
| Particles ~150 | 150 desktop / 60 mobile. |
| Pause when off-screen | IntersectionObserver toggles `frameloop`. |
| Textures ≤1024 | 1024×648 card, 512² nodes, 128² glow. |
| LCP < 2.5s | H1 stays SSR; canvas chunk lazy-loaded. |
| Design tokens | JSX/CSS uses `bg-background`, `text-*`, `Button`, `Pill`, `TrustBar`. Neon `#22E3FF` and teal `#0A8AA9` are scoped to inside the `<Canvas>` / gradient (allowed by brief). |
| Text legibility | `bg-gradient-to-r from-background via-background/80 to-transparent` scrim on lg. |
| Mobile | Stacked layout, dedicated canvas band, node/particle count reduced. |

## 6. Verification

After build:
- Playwright at 1440×900 → screenshot hero, confirm text left, canvas right/bleed, no layout shift.
- Playwright at 390×844 → confirm text stacks above 320px canvas band.
- `document.querySelectorAll('canvas').length` in mounted preview to confirm the 3D chunk hydrated.
- Toggle `prefers-reduced-motion` via emulateMedia, confirm no per-frame animation (screenshot at t=0 and t=2s are identical).

## Out of scope

- No changes to `StickyNav`, other sections, `Footer`, i18n keys, theme tokens, or copy.
- No `Suspense`-triggered layout shift: the right column always reserves `h-[560px]` on desktop / `h-[320px]` on mobile.
