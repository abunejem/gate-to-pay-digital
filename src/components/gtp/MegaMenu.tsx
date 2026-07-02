import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaMenuItem {
  label: string;
  description?: string;
}

interface MegaMenuColumn {
  heading: string;
  items: MegaMenuItem[];
}

interface MegaMenuProps {
  label: string;
  columns: MegaMenuColumn[];
  children?: ReactNode;
  width?: number;
}

const COL_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

export function MegaMenu({ label, columns, width = 760 }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const cols = Math.min(Math.max(columns.length, 1), 4);
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
            <div className={cn("grid gap-2", COL_CLASS[cols])}>
              {columns.map((col) => (
                <div key={col.heading} className="p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                    {col.heading}
                  </div>
                  <ul className="space-y-1">
                    {col.items.map((item) => (
                      <li key={item.label}>
                        <a
                          href="#"
                          className="block rounded-md ps-3 pe-3 py-2 hover:bg-muted transition-colors"
                        >
                          <div className="text-body-sm font-medium">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
