import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView, prefersReducedMotion } from "@/hooks/use-in-view";

interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

function format(n: number, decimals: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function StatCard({
  value,
  label,
  suffix = "",
  prefix = "",
  duration = 1600,
  decimals = 0,
  className,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const progress = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <div ref={ref} className={cn("motion-countup", className)}>
      <div className="text-display font-semibold text-primary dark:glow-text tabular-nums">
        {prefix}
        {format(display, decimals)}
        {suffix}
      </div>
      <div className="mt-2 text-body-sm text-muted-foreground">{label}</div>
    </div>
  );
}
