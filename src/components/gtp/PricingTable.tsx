import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

type Currency = "JOD" | "USD";

interface Plan {
  name: string;
  tagline: string;
  price: Record<Currency, number | "custom">;
  features: string[];
  cta: string;
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    tagline: "For teams beginning to accept payments",
    price: { JOD: 0, USD: 0 },
    features: ["Card acceptance", "Sandbox API access", "Email support"],
    cta: "Start free",
  },
  {
    name: "Growth",
    tagline: "For scaling merchants and platforms",
    price: { JOD: 249, USD: 349 },
    features: ["Everything in Starter", "Payouts & settlement", "Priority support", "Multi-currency"],
    cta: "Contact sales",
    featured: true,
  },
  {
    name: "Enterprise",
    tagline: "For banks, PSPs, and large processors",
    price: { JOD: "custom", USD: "custom" },
    features: ["Dedicated infrastructure", "24/7 SLA", "Custom BIN sponsorship", "White-label options"],
    cta: "Talk to us",
  },
];

export function PricingTable({ className }: { className?: string }) {
  const [currency, setCurrency] = useState<Currency>("JOD");
  return (
    <div className={className}>
      <div className="flex justify-center mb-8">
        <div
          role="radiogroup"
          aria-label="Currency"
          className="inline-flex items-center gap-1 rounded-pill border border-border bg-glass p-1 backdrop-blur-xl"
        >
          {(["JOD", "USD"] as Currency[]).map((c) => (
            <button
              key={c}
              role="radio"
              aria-checked={currency === c}
              onClick={() => setCurrency(c)}
              className={cn(
                "rounded-pill ps-4 pe-4 py-1.5 text-sm font-medium transition-colors",
                currency === c
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => {
          const p = plan.price[currency];
          return (
            <div
              key={plan.name}
              className={cn(
                "rounded-card border p-6 md:p-8 flex flex-col",
                plan.featured
                  ? "border-primary/50 bg-elevated dark:neon-edge"
                  : "border-border bg-elevated dark:bg-glass dark:backdrop-blur-xl",
              )}
            >
              <div className="text-body-sm text-muted-foreground">{plan.name}</div>
              <div className="mt-2 text-h3">{plan.tagline}</div>
              <div className="mt-6 flex items-baseline gap-1">
                {p === "custom" ? (
                  <span className="text-h1 font-semibold">Custom</span>
                ) : (
                  <>
                    <span className="text-body-sm text-muted-foreground">{currency}</span>
                    <span className="text-h1 font-semibold tabular-nums">{p}</span>
                    <span className="text-body-sm text-muted-foreground">/mo</span>
                  </>
                )}
              </div>
              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-body-sm">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.featured ? "primary" : "ghost"} className="mt-8 w-full">
                {plan.cta}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
