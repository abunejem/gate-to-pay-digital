import { useState, type ReactNode } from "react";
import { ChevronDown, ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MegaMenuItem {
  label: string;
  description?: string;
  icon?: LucideIcon;
  href?: string;
}

export interface MegaMenuColumn {
  heading: string;
  headingIcon?: LucideIcon;
  items: MegaMenuItem[];
}

export interface MegaMenuFeatured {
  eyebrow?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
}

interface MegaMenuProps {
  label: string;
  columns: MegaMenuColumn[];
  featured?: MegaMenuFeatured;
  children?: ReactNode;
  width?: number;
}

const COL_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

const TINT_BG = "color-mix(in srgb, var(--primary) 12%, transparent)";
const TINT_BORDER = "color-mix(in srgb, var(--primary) 28%, transparent)";

function ItemRow({ item }: { item: MegaMenuItem }) {
  const Icon = item.icon;
  return (
    <a
      href={item.href ?? "#"}
      className="group/row flex items-start gap-3 rounded-md ps-3 pe-3 py-2 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none transition-colors"
    >
      {Icon && (
        <span
          aria-hidden
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-primary transition-colors"
          style={{ background: TINT_BG, borderColor: TINT_BORDER }}
        >
          <Icon size={16} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-body-sm font-medium text-foreground truncate">
          {item.label}
        </span>
        {item.description && (
          <span className="block text-xs text-muted-foreground mt-0.5 leading-snug truncate">
            {item.description}
          </span>
        )}
      </span>
    </a>
  );
}

export function MegaMenu({ label, columns, featured, width = 760 }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const cols = Math.min(Math.max(columns.length, 1), 4);
  const FeatIcon = featured?.icon;
  return (
    <div
      className="relative"
      style={{ isolation: "isolate" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        className="inline-flex items-center gap-1 text-body-sm text-foreground/85 hover:text-foreground transition-colors py-2 ps-3 pe-3"
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className="absolute top-full start-0 pt-3 z-[60]"
          style={{ inlineSize: `min(${width}px, 92vw)` }}
        >
          <div
            className={cn(
              "rounded-card p-4 border",
              "bg-white border-border",
              "dark:bg-[rgba(8,38,56,0.98)] dark:border-[rgba(34,227,255,0.25)]",
            )}
            style={{
              boxShadow:
                "0 20px 60px rgba(2,10,20,0.45), 0 4px 12px rgba(2,10,20,0.25)",
              backdropFilter: "blur(24px) saturate(140%)",
            }}
          >
            <div className={cn("grid gap-4", featured ? "md:grid-cols-[1fr_260px]" : "grid-cols-1")}>
              <div className={cn("grid gap-2", COL_CLASS[cols])}>
                {columns.map((col) => {
                  const HIcon = col.headingIcon;
                  return (
                    <div key={col.heading} className="p-2">
                      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground mb-2 ps-3">
                        {HIcon && <HIcon size={12} className="text-primary" />}
                        {col.heading}
                      </div>
                      <ul className="space-y-0.5">
                        {col.items.map((item) => (
                          <li key={item.label}>
                            <ItemRow item={item} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              {featured && (
                <aside
                  className="rounded-lg p-4 border flex flex-col justify-between gap-3"
                  style={{ background: TINT_BG, borderColor: TINT_BORDER }}
                >
                  <div>
                    {FeatIcon && (
                      <span
                        aria-hidden
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-primary mb-3"
                        style={{ background: "color-mix(in srgb, var(--primary) 18%, transparent)", borderColor: TINT_BORDER }}
                      >
                        <FeatIcon size={18} />
                      </span>
                    )}
                    {featured.eyebrow && (
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        {featured.eyebrow}
                      </div>
                    )}
                    <div className="text-body-sm font-semibold text-foreground">{featured.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-snug">
                      {featured.description}
                    </div>
                  </div>
                  <a
                    href={featured.ctaHref ?? "#"}
                    className="inline-flex items-center gap-1 text-body-sm font-medium text-primary hover:underline"
                  >
                    {featured.ctaLabel}
                    <ArrowRight size={14} />
                  </a>
                </aside>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
