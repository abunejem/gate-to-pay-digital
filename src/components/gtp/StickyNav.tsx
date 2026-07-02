import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { MegaMenu } from "./MegaMenu";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function StickyNav() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "glass border-b border-border"
          : "bg-transparent border-b border-transparent",
      )}
      style={{ isolation: "isolate" }}
    >
      <div className="mx-auto max-w-7xl ps-6 pe-6 h-16 flex items-center gap-4">
        <Logo variant="horizontal" height={28} />
        <nav className="hidden lg:flex items-center gap-1 ms-4">
          <MegaMenu
            label={t("nav.products")}
            width={720}
            columns={[
              {
                heading: "Cards",
                items: [
                  { label: "Prepaid" },
                  { label: "Debit" },
                  { label: "Credit" },
                  { label: "Gift" },
                  { label: "Selfie" },
                  { label: "Co-branded" },
                  { label: "Branded" },
                ],
              },
              {
                heading: "Card Issuing",
                items: [{ label: "Card Issuing" }],
              },
              {
                heading: "Wallets",
                items: [{ label: "Personal" }, { label: "Merchant" }],
              },
            ]}
          />
          <MegaMenu
            label={t("nav.solutions")}
            width={880}
            columns={[
              {
                heading: "Pay",
                items: [
                  { label: "Supply Chain Payments" },
                  { label: "Bulk Payouts" },
                ],
              },
              {
                heading: "Collect",
                items: [
                  { label: "Marketplace & Platform Payments" },
                  { label: "Merchant Acceptance" },
                ],
              },
              {
                heading: "Control",
                items: [
                  { label: "Corporate Spend Control" },
                  { label: "Just-in-Time Funding" },
                  { label: "Escrow Services" },
                ],
              },
              {
                heading: "Engage",
                items: [
                  { label: "Community Payments" },
                  { label: "Loyalty & Rewards" },
                ],
              },
            ]}
          />
          <MegaMenu
            label={t("nav.platform")}
            width={820}
            columns={[
              {
                heading: "Infrastructure",
                items: [
                  { label: "Embedded Finance" },
                  { label: "Multi-Rail Connectivity" },
                  { label: "BIN Sponsorship" },
                  { label: "Card as a Service" },
                ],
              },
              {
                heading: "Rails & Ops",
                items: [
                  { label: "Payment Rails" },
                  { label: "Wallet Infrastructure" },
                  { label: "Settlement & Reconciliation" },
                  { label: "Compliance Framework" },
                ],
              },
              {
                heading: "Services",
                items: [
                  { label: "Managed Programs" },
                  { label: "Professional Services" },
                  { label: "Regulatory Advisory" },
                ],
              },
            ]}
          />
          <MegaMenu
            label={t("nav.whoItsFor")}
            width={640}
            columns={[
              {
                heading: "Segments",
                items: [
                  { label: "Businesses" },
                  { label: "Merchants & Online Stores" },
                  { label: "Platforms & Marketplaces" },
                  { label: "Fintechs" },
                  { label: "Banks & Financial Institutions" },
                  { label: "Government" },
                  { label: "Communities" },
                ],
              },
            ]}
          />
          <a href="#" className="text-body-sm text-foreground/85 hover:text-foreground py-2 ps-3 pe-3">
            {t("nav.developers")}
          </a>
          <a href="#" className="text-body-sm text-foreground/85 hover:text-foreground py-2 ps-3 pe-3">
            {t("nav.company")}
          </a>
          <a href="#" className="text-body-sm text-foreground/85 hover:text-foreground py-2 ps-3 pe-3">
            {t("nav.pricing")}
          </a>
        </nav>
        <div className="ms-auto flex items-center gap-3">
          <ThemeToggle />
          <a href="#" className="hidden sm:inline text-body-sm text-foreground/85 hover:text-foreground">
            {t("nav.signIn")}
          </a>
          <Button size="sm">{t("nav.getStarted")}</Button>
        </div>
      </div>
    </header>
  );
}
