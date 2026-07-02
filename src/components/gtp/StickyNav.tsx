import { useEffect, useState } from "react";
import {
  Wallet, CreditCard, Gift, ScanFace, Layers, BadgeCheck, Cpu, Store,
  ArrowRightLeft, Download, SlidersHorizontal, Sparkles,
  Boxes, Network, Landmark, Cog,
  Building2, ShoppingBag, LayoutGrid, Rocket, Banknote, Shield, Users,
  BookOpen, Truck, Send, Zap, Lock, MessageSquare,
} from "lucide-react";
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
            featured={{
              eyebrow: "Featured",
              icon: Cpu,
              title: "Issue on your own BIN",
              description: "Launch physical and virtual card programs on our Mastercard Principal BIN via a single API.",
              ctaLabel: "Read the docs",
            }}
            columns={[
              {
                heading: "Cards",
                headingIcon: CreditCard,
                headingHref: "/products/cards",
                items: [
                  { label: "Prepaid", description: "Load-and-spend balances", icon: Wallet },
                  { label: "Debit", description: "Spend from a linked wallet", icon: CreditCard },
                  { label: "Credit", description: "Configurable credit lines", icon: CreditCard },
                  { label: "Gift", description: "Stored-value & promotions", icon: Gift },
                  { label: "Selfie", description: "Personalized card design", icon: ScanFace },
                  { label: "Co-branded", description: "Partner-branded on our BIN", icon: Layers },
                  { label: "Branded", description: "Fully branded programs", icon: BadgeCheck },
                ],
              },
              {
                heading: "Wallets",
                headingIcon: Wallet,
                items: [
                  { label: "Personal", description: "White-label end-user wallets", icon: Wallet },
                  { label: "Merchant", description: "Collect, hold & settle funds", icon: Store },
                ],
              },
            ]}
          />
          <MegaMenu
            label={t("nav.solutions")}
            width={880}
            columns={[
              {
                heading: "Pay",
                headingIcon: ArrowRightLeft,
                items: [
                  { label: "Supply Chain Payments", description: "Pay suppliers across markets", icon: Truck },
                  { label: "Bulk Payouts", description: "Disburse to many at once", icon: Send },
                ],
              },
              {
                heading: "Collect",
                headingIcon: Download,
                items: [
                  { label: "Marketplace Payments", description: "Split, hold and settle for sellers", icon: Store },
                  { label: "Merchant Acceptance", description: "Accept cards and local rails", icon: CreditCard },
                ],
              },
              {
                heading: "Control",
                headingIcon: SlidersHorizontal,
                items: [
                  { label: "Corporate Spend Control", description: "Rules, limits and approvals", icon: SlidersHorizontal },
                  { label: "Just-in-Time Funding", description: "Fund cards at the moment of spend", icon: Zap },
                  { label: "Escrow Services", description: "Hold funds until conditions clear", icon: Lock },
                ],
              },
              {
                heading: "Engage",
                headingIcon: Sparkles,
                items: [
                  { label: "Community Payments", description: "Programs for members and groups", icon: Users },
                  { label: "Loyalty & Rewards", description: "Cashback, points and incentives", icon: Gift },
                ],
              },
            ]}
          />
          <MegaMenu
            label={t("nav.platform")}
            width={860}
            featured={{
              eyebrow: "Developers",
              icon: BookOpen,
              title: "One API, many rails",
              description: "Cards, wallets and payments through a single, well-documented API.",
              ctaLabel: "Read the docs",
            }}
            columns={[
              {
                heading: "Infrastructure",
                headingIcon: Boxes,
                items: [
                  { label: "Embedded Finance", description: "Ship financial features inside your product", icon: Boxes },
                  { label: "Multi-Rail Connectivity", description: "Local and international rails", icon: Network },
                  { label: "BIN Sponsorship", description: "Launch on our Mastercard BIN", icon: BadgeCheck },
                  { label: "Card as a Service", description: "Turnkey issuing stack", icon: CreditCard },
                ],
              },
              {
                heading: "Rails & Ops",
                headingIcon: Network,
                items: [
                  { label: "Payment Rails", description: "Cards, CliQ and more", icon: Network },
                  { label: "Wallet Infrastructure", description: "Balances, ledgers, KYC", icon: Wallet },
                  { label: "Settlement & Reconciliation", description: "Automated end-to-end", icon: Landmark },
                  { label: "Compliance Framework", description: "CBJ-licensed, PCI DSS", icon: Shield },
                ],
              },
              {
                heading: "Services",
                headingIcon: Cog,
                items: [
                  { label: "Managed Programs", description: "We operate your program end-to-end", icon: Cog },
                  { label: "Professional Services", description: "Design, launch and scale", icon: Cog },
                  { label: "Regulatory Advisory", description: "Navigate local requirements", icon: Shield },
                ],
              },
            ]}
          />
          <MegaMenu
            label={t("nav.whoItsFor")}
            width={640}
            featured={{
              eyebrow: "Not sure where you fit?",
              icon: MessageSquare,
              title: "Talk to our team",
              description: "We'll help you find the right setup for your business.",
              ctaLabel: "Book a discovery call",
            }}
            columns={[
              {
                heading: "Segments",
                headingIcon: Users,
                items: [
                  { label: "Businesses", description: "Corporate spend, payouts and cards", icon: Building2 },
                  { label: "Merchants & Online Stores", description: "Accept payments and manage funds", icon: ShoppingBag },
                  { label: "Platforms & Marketplaces", description: "Embed payments for your users", icon: LayoutGrid },
                  { label: "Fintechs", description: "Launch on regulated infrastructure", icon: Rocket },
                  { label: "Banks & Institutions", description: "Extend product lines quickly", icon: Banknote },
                  { label: "Government", description: "Disburse funds and modernise rails", icon: Landmark },
                  { label: "Communities", description: "Programs for members and groups", icon: Users },
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
