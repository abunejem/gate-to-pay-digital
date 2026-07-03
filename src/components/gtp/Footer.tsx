import { Logo } from "./Logo";
import { useT } from "@/lib/i18n";

const cols = [
  {
    heading: "Products",
    links: ["Card issuing", "Acquiring", "Gateway", "Payouts", "Remittance"],
  },
  {
    heading: "Solutions",
    links: ["Banks & PSPs", "Fintechs", "Marketplaces", "Enterprise"],
  },
  {
    heading: "Developers",
    links: ["API reference", "SDKs", "Status", "Changelog"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Newsroom", "Contact"],
  },
];

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-8 sm:gap-10 grid-cols-2 md:grid-cols-6">
          <div className="col-span-2 md:col-span-2">
            <Logo variant="horizontal" height={32} />
            <p className="mt-4 text-body-sm text-muted-foreground max-w-xs">
              {t("brand.tagline")}. Central Bank of Jordan licensed since 2014.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.heading}>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">{c.heading}</div>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-body-sm text-foreground/80 hover:text-primary transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {year} {t("brand.name")}. {t("footer.rights")}</div>
          <div>{t("footer.address")} · CBJ Licensed · Mastercard Principal Member · PCI DSS</div>
        </div>
      </div>
    </footer>
  );
}
