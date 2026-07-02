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
    >
      <div className="mx-auto max-w-7xl ps-6 pe-6 h-16 flex items-center gap-6">
        <Logo variant="horizontal" height={28} />
        <nav className="hidden md:flex items-center gap-2 ms-4">
          <MegaMenu
            label={t("nav.products")}
            columns={[
              {
                heading: "Issuing",
                items: [
                  { label: "Card issuing", description: "Physical & virtual cards" },
                  { label: "Program management", description: "BIN sponsorship" },
                ],
              },
              {
                heading: "Acquiring",
                items: [
                  { label: "Merchant acquiring", description: "Card acceptance" },
                  { label: "Payment gateway", description: "Online checkout" },
                ],
              },
              {
                heading: "Money movement",
                items: [
                  { label: "Payouts", description: "Global disbursement" },
                  { label: "Remittance", description: "Cross-border transfers" },
                ],
              },
            ]}
          />
          <MegaMenu
            label={t("nav.solutions")}
            columns={[
              {
                heading: "By industry",
                items: [
                  { label: "Banks & PSPs" },
                  { label: "Fintech startups" },
                  { label: "Marketplaces" },
                ],
              },
              {
                heading: "By region",
                items: [
                  { label: "MENA" },
                  { label: "GCC" },
                  { label: "Global" },
                ],
              },
            ]}
          />
          <a href="#" className="text-body-sm text-foreground/85 hover:text-foreground py-2 ps-3 pe-3">
            {t("nav.developers")}
          </a>
          <a href="#" className="text-body-sm text-foreground/85 hover:text-foreground py-2 ps-3 pe-3">
            {t("nav.pricing")}
          </a>
          <a href="#" className="text-body-sm text-foreground/85 hover:text-foreground py-2 ps-3 pe-3">
            {t("nav.company")}
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
