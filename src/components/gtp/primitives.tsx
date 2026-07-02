import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: "default" | "primary" | "muted";
}

export function Pill({ children, className, tone = "default", ...rest }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill ps-3 pe-3 py-1 text-xs font-medium border",
        tone === "primary" && "border-primary/40 text-primary bg-primary/10",
        tone === "muted" && "border-border text-muted-foreground bg-muted",
        tone === "default" && "border-border text-foreground bg-glass backdrop-blur-xl",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassPanel({ children, className, ...rest }: GlassPanelProps) {
  return (
    <div className={cn("glass rounded-card", className)} {...rest}>
      {children}
    </div>
  );
}
