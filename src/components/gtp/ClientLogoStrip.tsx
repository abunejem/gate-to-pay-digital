import { cn } from "@/lib/utils";

// Confirmed clients only. Text-badge placeholders until real logo assets are uploaded.
const CLIENTS = [
  "Samsung",
  "Orange Money",
  "Equiti",
  "ATFX",
  "INGOT",
  "CFI",
  "CASHU",
  "Altibbi",
  "NatHealth",
];

export function ClientLogoStrip({ className }: { className?: string }) {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <div className={cn("relative overflow-hidden py-6", className)}>
      <div
        className="pointer-events-none absolute inset-y-0 start-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, var(--color-background), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 end-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, var(--color-background), transparent)" }}
      />
      <div className="motion-marquee flex w-max items-center gap-12">
        {row.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex h-10 min-w-[140px] items-center justify-center rounded-md ps-4 pe-4 text-sm font-medium tracking-wide grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-[opacity,filter] duration-300 text-muted-foreground hover:text-primary"
            title={`${name} — logo placeholder`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
