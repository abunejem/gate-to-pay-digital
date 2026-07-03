import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { StickyNav } from "@/components/gtp/StickyNav";
import { Footer } from "@/components/gtp/Footer";
import { Button } from "@/components/gtp/Button";
import { BentoTile } from "@/components/gtp/BentoTile";
import { StatCard } from "@/components/gtp/StatCard";
import { TrustBar } from "@/components/gtp/TrustBar";
import { ClientLogoStrip } from "@/components/gtp/ClientLogoStrip";
import { ApiResponseCard } from "@/components/gtp/ApiResponseCard";
import { Reveal } from "@/components/gtp/Reveal";
import { Pill } from "@/components/gtp/primitives";
import { StoryScroll } from "@/components/gtp/StoryScroll";
import { MoneyFlowDiagram } from "@/components/gtp/MoneyFlowDiagram";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    links: [{ rel: "canonical", href: "/" }],
    meta: [{ property: "og:url", content: "/" }],
  }),
});

const PRODUCTS = [
  { title: "Cards", body: "Issue physical, virtual & tokenized cards via one API." },
  { title: "Wallets", body: "Personal & merchant wallets, funded across rails." },
  { title: "Acceptance", body: "Accept payments in store and online." },
  { title: "Payouts", body: "Single & bulk disbursements, instantly." },
  { title: "Collections", body: "Marketplace & merchant collections." },
  { title: "Embedded Finance", body: "Embed cards, wallets and payments inside your own product." },
];

const AUDIENCES = [
  "Businesses",
  "Merchants & Online Stores",
  "Platforms & Marketplaces",
  "Fintechs",
  "Banks & Financial Institutions",
  "Government",
  "Communities",
];

const WHY = [
  { title: "CBJ Licensed", body: "A licensed PSP with direct network access." },
  { title: "Mastercard Principal Member", body: "Issue cards and sponsor BINs without a third party." },
  { title: "Neutral by design", body: "B2B/B2B2C only; we never compete with you for consumers." },
  { title: "Jordan-native, globally connected", body: "Local rails and the Mastercard network in one platform." },
];

const STORY_STEPS = [
  {
    eyebrow: "The challenge",
    title: "Growth multiplies complexity.",
    body: "More payment flows, more providers, more rails, more compliance. Every new market, product and partner adds operational and regulatory weight.",
  },
  {
    eyebrow: "The platform",
    title: "One regulated platform, every connection.",
    body: "Gate to Pay connects your payment providers, banks, systems and rails behind one platform — with smart routing, automation, reconciliation and real-time visibility.",
  },
  {
    eyebrow: "The result",
    title: "Scale, safely, without slowing down.",
    body: "Scale your business · Stay compliant & safe · Operate efficiently · See everything, act faster.",
  },
];

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

function HomePage() {
  const t = useT();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StickyNav />

      {/* Hero */}
      <section className="relative px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        <div
          className="motion-gradient-mesh pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 0%, rgba(34,227,255,0.18), transparent 70%), radial-gradient(40% 30% at 80% 30%, rgba(10,138,169,0.18), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <Pill tone="primary" className="mb-6">{t("hero.eyebrow")}</Pill>
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
            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3">
              <Button size="lg" className="w-full sm:w-auto">
                {t("hero.ctaPrimary")} <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="ghost" className="w-full sm:w-auto">{t("hero.ctaSecondary")}</Button>
            </div>
          </Reveal>
          <Reveal delay={320} className="mt-10">
            <TrustBar />
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="ps-6 pe-6 py-16 border-t border-border">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-4">
          <StatCard value={1} suffix="B+" label="Processed transactions" />
          <StatCard value={160} suffix="K+" label="Customers served" />
          <StatCard value={200} suffix="+" label="Corporate clients" />
          <StatCard value={17} suffix="+" label="Countries served" />
        </div>
      </section>

      {/* Products bento */}
      <section className="ps-6 pe-6 py-20 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-h1">One platform. Every building block.</h2>
            <p className="mt-3 text-body-lg text-muted-foreground max-w-2xl">
              Start with a product or compose several — all on the same regulated core.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <BentoTile>
                  <div className="text-h3 font-medium">{p.title}</div>
                  <p className="mt-2 text-body-sm text-muted-foreground">{p.body}</p>
                  <div className="mt-6 inline-flex items-center gap-1 text-body-sm text-primary">
                    Learn more <ArrowRight size={14} />
                  </div>
                </BentoTile>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Client logo strip */}
      <section className="ps-6 pe-6 py-16 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-center text-body-sm text-muted-foreground">
              Trusted by leading businesses across the region and beyond.
            </p>
          </Reveal>
          <ClientLogoStrip className="mt-6" />
        </div>
      </section>

      {/* Story scrollytelling */}
      <StoryScroll
        heading="As you scale, money gets complicated. We make it simple."
        steps={STORY_STEPS}
      />

      {/* Signature — Multi-rail diagram */}
      <section className="ps-6 pe-6 py-24 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <Pill tone="primary" className="mb-4">Multi-rail</Pill>
              <h2 className="text-h1">One integration. Every rail.</h2>
              <p className="mt-3 mx-auto max-w-2xl text-body-lg text-muted-foreground">
                Connect once and move money across local rails — CliQ, JoMoPay, eFAWATEERcom — and the
                Mastercard network, with smart routing that picks the best path automatically.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="mt-12">
            <MoneyFlowDiagram />
          </Reveal>
        </div>
      </section>

      {/* Who it's for */}
      <section className="ps-6 pe-6 py-20 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-h1">Built for connected businesses.</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a, i) => (
              <Reveal key={a} delay={i * 50}>
                <BentoTile>
                  <div className="text-h3 font-medium">{a}</div>
                  <div className="mt-6 inline-flex items-center gap-1 text-body-sm text-primary">
                    Explore <ArrowRight size={14} />
                  </div>
                </BentoTile>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Gate to Pay */}
      <section className="ps-6 pe-6 py-20 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-h1">Regulated, neutral, and built in-house.</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <BentoTile>
                  <div className="text-h3 font-medium">{w.title}</div>
                  <p className="mt-2 text-body-sm text-muted-foreground">{w.body}</p>
                </BentoTile>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured success story */}
      <section className="ps-6 pe-6 py-20 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div
              className="rounded-card p-10 md:p-14"
              style={{ backgroundColor: "var(--color-story)", color: "var(--color-story-foreground)" }}
            >
              <Pill tone="primary" className="mb-4">Live in production · Supply Chain Payments</Pill>
              <h2 className="text-h2" style={{ color: "var(--color-story-foreground)" }}>
                From WhatsApp orders and spreadsheet credit to instant, reconciled payments.
              </h2>
              <p className="mt-4 max-w-2xl text-body-lg opacity-85">
                A pharmaceutical distributor replaced manual ordering, spreadsheet credit management and
                manual reconciliation with Gate to Pay. Orders moved off WhatsApp, credit is checked
                before every order, and invoices are delivered and paid instantly.
              </p>
              <div className="mt-8">
                <Button variant="primary">Read the story <ArrowRight size={16} /></Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Developer teaser */}
      <section className="ps-6 pe-6 py-20 border-t border-border">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2 items-center">
          <Reveal>
            <h2 className="text-h1">Built for developers, too.</h2>
            <p className="mt-4 text-body-lg text-muted-foreground max-w-xl">
              Full API access, sandbox with real credentials, SDKs and webhooks. Integrate cards,
              wallets and payments through one API.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button>Read the docs <ArrowRight size={16} /></Button>
              <Button variant="ghost">Get sandbox access</Button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ApiResponseCard code={API_SAMPLE} lang="json" title="POST /v1/payments · 200 OK" />
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="ps-6 pe-6 py-24 border-t border-border">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-h1">Let's build your financial infrastructure.</h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              A discovery session with our team. No commitment.
            </p>
            <div className="mt-8">
              <Button size="lg">Book a discovery call <ArrowRight size={16} /></Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
