## Fixes before page build

### 1. Mega-menu opacity bug (`src/components/gtp/MegaMenu.tsx`)
Replace the current `.glass` panel with a solid, elevated surface:
- Dark: `background: rgba(8, 38, 56, 0.98)` (near-opaque `--elevated`), `backdrop-filter: blur(24px) saturate(140%)`, `border: 1px solid rgba(34,227,255,0.25)` (neon-tint), strong drop shadow.
- Light: `background: #FFFFFF`, `border: 1px solid var(--border)`, soft shadow (`0 12px 40px rgba(2,42,68,0.12)`).
- Add a full-viewport transparent scrim behind the open panel (pointer-events transparent) to reinforce stacking and close-on-outside-click.
- Raise stacking: menu wrapper `z-50`, panel `z-[60]`; ensure `StickyNav` header creates the stacking context (`isolation: isolate`) so no hero/section layer intercepts.
- Verify legibility by opening the menu over the hero and over a story panel in both themes.

### 2. Restore approved hero copy (`src/routes/index.tsx` + `src/lib/i18n/en.ts`)
- Eyebrow pill: `Regulated financial infrastructure · Jordan`
- H1: `The financial infrastructure behind ` + `<span class="text-primary dark:glow-text">connected businesses</span>` + `.`
- Sub: `Issue cards, open wallets, accept payments, and move money across local and global rails — on one regulated platform. We hold the licenses and build the rails, so you don't have to.`
- Primary CTA `Get started`; secondary `Explore the platform`.
- Nav sign-in label → `Client Login` (update `nav.signIn` in `en.ts`).

### 3. Stat cards — approved figures only
Replace the four invented stats with:
- `1B+` Processed transactions
- `160K+` Customers served
- `200+` Corporate clients
- `17+` Countries served

Since values include `B`/`K` suffixes, render as pre-formatted strings. Extend `StatCard` to accept an optional `displayValue: string` that skips the count-up (or accepts a suffix-aware format). Simpler: add a `formatted` prop; when set, the count-up animates numeric portion `1 → target` and appends the suffix string. For `1B+`, `160K+`, `200+`, `17+`, animate the leading integer and append the suffix. Reduced-motion shows the final string immediately.

### 4. Client logo strip (`src/components/gtp/ClientLogoStrip.tsx`)
Replace the CLIENTS array with: Samsung, Orange Money, Equiti, ATFX, INGOT, CFI, CASHU, Altibbi, NatHealth. Keep text-badge placeholders until the user uploads logo files (each badge visibly labeled as the client name; swap-in will be a later pass once assets arrive).

### 5. Pricing — placeholder
Remove the invented `PLANS` array and JOD/USD sample tiers from the showcase section. Replace the Pricing showcase block with a placeholder panel:
> "Pricing — real fee tables, limits, and currency toggle will be wired here once approved copy is provided."
Keep the `PricingTable` component file in place but export a stub that renders the placeholder, so future work only needs to fill data.

### 6 + 7. Full top-level nav with confirmed taxonomy (`src/components/gtp/StickyNav.tsx` + `MegaMenu.tsx`)

Top-level order: Products · Solutions · Platform · Who it's for · Developers · Company · Pricing.

Mega-menu columns (exact taxonomy):

- **Products**
  - Cards: Prepaid, Debit, Credit, Gift, Selfie, Co-branded, Branded
  - Card Issuing
  - Wallets: Personal, Merchant

- **Solutions** (grouped)
  - Pay: Supply Chain Payments, Bulk Payouts
  - Collect: Marketplace & Platform Payments, Merchant Acceptance
  - Control: Corporate Spend Control, Just-in-Time Funding, Escrow Services
  - Engage: Community Payments, Loyalty & Rewards

- **Platform**
  - Embedded Finance, Multi-Rail Connectivity, BIN Sponsorship, Card as a Service, Payment Rails, Wallet Infrastructure, Settlement & Reconciliation, Compliance Framework
  - Services: Managed Programs, Professional Services, Regulatory Advisory

- **Who it's for**
  - Businesses, Merchants & Online Stores, Platforms & Marketplaces, Fintechs, Banks & Financial Institutions, Government, Communities

- Developers / Company / Pricing = simple links (no dropdown yet).

`MegaMenu` currently caps at 3 columns via a template-literal Tailwind class (`grid-cols-${n}`, which does not JIT). Fix by using an explicit style/grid mapping supporting 2–4 columns so Platform and Solutions render cleanly.

### 8. Positioning
No copy change needed beyond the hero (already broad). No lingering "banks, PSPs, fintechs" phrasing remains after hero replacement — verify and remove if found elsewhere in the showcase.

### 9. Tagline "Where Fintech Dreams Begin"
Not confirmed in provided material. Remove any occurrence (search `src/` — currently absent) and do NOT add it. `en.ts` `brand.tagline` will be set to a neutral placeholder `Financial infrastructure for MENA and beyond` (already present) pending user confirmation.

### Files touched
- `src/components/gtp/MegaMenu.tsx` — solid surface, stacking, 2–4 col grid.
- `src/components/gtp/StickyNav.tsx` — full nav, new menu data.
- `src/components/gtp/StatCard.tsx` — accept pre-formatted target with suffix.
- `src/components/gtp/ClientLogoStrip.tsx` — new client list.
- `src/components/gtp/PricingTable.tsx` — stub with placeholder.
- `src/routes/index.tsx` — approved hero, updated stats data, pricing placeholder.
- `src/lib/i18n/en.ts` — `nav.signIn = "Client Login"`, hero strings.

### Out of scope
No new pages, no logo assets (awaiting upload), no real pricing data, no tagline.
