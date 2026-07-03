import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

// Static SVG diagram with pulses animated via CSS. Reduced-motion strips the
// animation because the class is prefixed with `motion-` (see styles.css).
const RAILS = ["CliQ", "JoMoPay", "eFAWATEERcom", "Mastercard"];

export function MoneyFlowDiagram({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox="0 0 800 380"
        className="w-full h-auto"
        role="img"
        aria-label="Your product connects to Gate to Pay, which routes to CliQ, JoMoPay, eFAWATEERcom and Mastercard."
      >
        <defs>
          <radialGradient id="hub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.55" />
            <stop offset="60%" stopColor="var(--color-primary)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Source */}
        <g>
          <rect x="20" y="160" width="150" height="60" rx="12"
            fill="var(--color-elevated)" stroke="var(--color-border)" />
          <text x="95" y="197" textAnchor="middle"
            fill="var(--color-foreground)" fontSize="18" fontWeight="500">
            Your product
          </text>
        </g>

        {/* Hub glow */}
        <circle cx="400" cy="190" r="120" fill="url(#hub)" />

        {/* Hub */}
        <g>
          <circle cx="400" cy="190" r="72"
            fill="var(--color-elevated)"
            stroke="var(--color-primary)"
            strokeWidth="1.5" />
          <foreignObject x="340" y="140" width="120" height="100">
            <div className="w-full h-full flex items-center justify-center">
              <Logo variant="vertical" height={80} />
            </div>
          </foreignObject>
        </g>

        {/* Left path source -> hub */}
        <path d="M 170 190 L 342 190"
          stroke="var(--color-border-strong)" strokeWidth="1.5" fill="none" />
        <circle r="4" fill="var(--color-primary)" className="motion-flow-pulse">
          <animateMotion dur="2.2s" repeatCount="indefinite" path="M 170 190 L 342 190" />
        </circle>

        {/* Right paths hub -> rails (4 nodes) */}
        {RAILS.map((label, i) => {
          const y = 60 + i * 87;
          const path = `M 458 190 C 560 190 560 ${y + 20} 640 ${y + 20}`;
          return (
            <g key={label}>
              <path d={path} stroke="var(--color-border-strong)" strokeWidth="1.5" fill="none" />
              <circle r="3.5" fill="var(--color-primary)" className="motion-flow-pulse">
                <animateMotion dur="2.6s" begin={`${i * 0.35}s`} repeatCount="indefinite" path={path} />
              </circle>
              <rect x="640" y={y} width="140" height="40" rx="10"
                fill="var(--color-elevated)" stroke="var(--color-border)" />
              <text x="710" y={y + 26} textAnchor="middle"
                fill="var(--color-foreground)" fontSize="17" fontWeight="500">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
