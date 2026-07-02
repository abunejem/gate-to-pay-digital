import { cn } from "@/lib/utils";

/**
 * Pricing placeholder.
 *
 * Real fee tables, limits, and the JOD ↔ USD toggle will be wired here
 * once approved copy is provided. Do NOT invent tier names or prices.
 */
export function PricingTable({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-card border border-dashed border-border p-8 md:p-12 text-center bg-elevated dark:bg-glass dark:backdrop-blur-xl",
        className,
      )}
    >
      <div className="text-body-sm uppercase tracking-wide text-muted-foreground">
        Placeholder
      </div>
      <div className="mt-2 text-h3">Pricing table coming soon</div>
      <p className="mx-auto mt-3 max-w-xl text-body-sm text-muted-foreground">
        Real fee tables, limits, and the JOD ↔ USD toggle will appear here once
        approved pricing copy is provided.
      </p>
    </div>
  );
}
