import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaMenuColumn {
  heading: string;
  items: { label: string; description?: string }[];
}

interface MegaMenuProps {
  label: string;
  columns: MegaMenuColumn[];
  children?: ReactNode;
}

export function MegaMenu({ label, columns }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        className="inline-flex items-center gap-1 text-body-sm text-foreground/85 hover:text-foreground transition-colors py-2"
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className="absolute top-full start-0 pt-3 z-50"
          style={{ minInlineSize: "min(720px, 90vw)" }}
        >
          <div className="glass rounded-card p-4 shadow-elevated">
            <div className={cn("grid gap-2", `grid-cols-${Math.min(columns.length, 3)}`)}>
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
                            <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
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
