import { createFileRoute } from "@tanstack/react-router";
import { StickyNav } from "@/components/gtp/StickyNav";
import { Footer } from "@/components/gtp/Footer";
import { Button } from "@/components/gtp/Button";
import { BentoTile } from "@/components/gtp/BentoTile";
import { StatCard } from "@/components/gtp/StatCard";
import { TrustBar } from "@/components/gtp/TrustBar";
import { ClientLogoStrip } from "@/components/gtp/ClientLogoStrip";
import { ApiResponseCard } from "@/components/gtp/ApiResponseCard";
import { FaqAccordion } from "@/components/gtp/FaqAccordion";
import { PricingTable } from "@/components/gtp/PricingTable";
import { Reveal } from "@/components/gtp/Reveal";
import { Pill, GlassPanel } from "@/components/gtp/primitives";
import { Logo } from "@/components/gtp/Logo";
import { useT } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Showcase,
});

function Section({
  id,
  title,
  desc,
  children,
}: {
  id: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="ps-6 pe-6 py-16 border-t border-border">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Pill tone="primary" className="mb-4">
            {id}
          </Pill>
          <h2 className="text-h2">{title}</h2>
          {desc && <p className="mt-2 text-body text-muted-foreground max-w-2xl">{desc}</p>}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

const API_SAMPLE = `{
  "id": "pmt_01H8Q4ZK9J7RXAB2C3D4E5F6G7",
  "amount": 2500,
  "currency": "JOD",
  "status": "succeeded",
  "network": "mastercard",
  "merchant": {
    "id": "mch_example_02",
    "country": "JO"
  },
  "created": "2026-06-24T14:22:19Z"
}`;

function Showcase() {
  const t = useT();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StickyNav />

      {/* Hero */}
      <section className="relative ps-6 pe-6 pt-20 pb-24 overflow-hidden">
        <div
          className="motion-gradient-mesh pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 0%, rgba(34,227,255,0.18), transparent 70%), radial-gradient(40% 30% at 80% 30%, rgba(10,138,169,0.18), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <Pill tone="primary" className="mb-6">
              {t("hero.eyebrow")}
            </Pill>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-display font-semibold">
              {t("hero.h1Before")}
              <span className="text-primary dark:glow-text">{t("hero.h1Highlight")}</span>
              {t("hero.h1After")}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-body-lg text-muted-foreground">
              {t("hero.sub")}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg">
                {t("hero.ctaPrimary")} <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="ghost">
                {t("hero.ctaSecondary")}
              </Button>
            </div>
          </Reveal>
          <Reveal delay={320} className="mt-10">
            <TrustBar />
          </Reveal>
        </div>
      </section>

      {/* Buttons */}
      <Section id="buttons" title="Buttons" desc="Primary uses neon fill with navy text for AA contrast; glow reserved for dark theme.">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm">Primary sm</Button>
          <Button variant="primary" size="md">Primary md</Button>
          <Button variant="primary" size="lg">Primary lg</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </Section>

      {/* Bento tiles */}
      <Section id="bento" title="Bento tiles" desc="Glass in dark, elevated card in light. Hover for neon edge / soft shadow.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "Issue", d: "Cards and wallets — programmatic, regulated." },
            { t: "Collect", d: "Merchant acceptance and platform payments." },
            { t: "Move", d: "Payouts and settlement across local and global rails." },
          ].map((x) => (
            <BentoTile key={x.t}>
              <div className="text-h3 font-medium">{x.t}</div>
              <p className="mt-2 text-body-sm text-muted-foreground">{x.d}</p>
              <div className="mt-6 inline-flex items-center gap-1 text-body-sm text-primary">
                Learn more <ArrowRight size={14} />
              </div>
            </BentoTile>
          ))}
        </div>
      </Section>

      {/* Stats — approved figures only */}
      <Section id="stats" title="Stat cards" desc="Count-up on scroll; instant final value under reduced motion.">
        <div className="grid gap-8 md:grid-cols-4">
          <StatCard value={1} label="Processed transactions" suffix="B+" />
          <StatCard value={160} label="Customers served" suffix="K+" />
          <StatCard value={200} label="Corporate clients" suffix="+" />
          <StatCard value={17} label="Countries served" suffix="+" />
        </div>
      </Section>

      {/* Client strip */}
      <Section id="clients" title="Client logo strip" desc="Confirmed clients only. Text placeholders shown until logo assets are uploaded.">
        <ClientLogoStrip />
      </Section>

      {/* API response card */}
      <Section id="api" title="API response card" desc="Server-highlighted with shiki; swaps theme with the site.">
        <div className="max-w-2xl">
          <ApiResponseCard code={API_SAMPLE} lang="json" title="POST /v1/payments · 200 OK" />
        </div>
      </Section>

      {/* Story panel (navy) */}
      <section className="ps-6 pe-6 py-16 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div
            className="rounded-card p-10 md:p-14"
            style={{ backgroundColor: "var(--color-story)", color: "var(--color-story-foreground)" }}
          >
            <Pill tone="primary" className="mb-4">Story section</Pill>
            <h2 className="text-h2" style={{ color: "var(--color-story-foreground)" }}>
              Navy background · teal accents · both themes.
            </h2>
            <p className="mt-3 max-w-2xl opacity-80">
              A dedicated surface for narrative sections. Same treatment in light and dark themes,
              anchored on the brand navy #022A44.
            </p>
          </div>
        </div>
      </section>

      {/* Glass panel */}
      <Section id="glass" title="Glass panel" desc="Reusable translucent surface with backdrop blur.">
        <GlassPanel className="p-8">
          <div className="flex items-center gap-4">
            <Logo variant="icon" height={40} />
            <div>
              <div className="text-h3">Glass panel</div>
              <p className="text-body-sm text-muted-foreground">Sits over any background, respects theme tokens.</p>
            </div>
          </div>
        </GlassPanel>
      </Section>

      {/* Pricing — placeholder */}
      <Section id="pricing" title="Pricing table" desc="Awaiting approved fee tables and limits.">
        <PricingTable />
      </Section>

      {/* FAQ */}
      <Section id="faq" title="FAQ accordion">
        <div className="max-w-3xl">
          <FaqAccordion
            items={[
              { q: "Is Gate to Pay regulated?", a: "Yes — licensed by the Central Bank of Jordan since 2014." },
              { q: "Which card networks do you support?", a: "Mastercard (Principal Member), Visa, and UnionPay." },
              { q: "Who does Gate to Pay serve?", a: "Businesses, merchants, platforms, fintechs, banks, government, and communities." },
            ]}
          />
        </div>
      </Section>

      <Footer />
    </div>
  );
}
