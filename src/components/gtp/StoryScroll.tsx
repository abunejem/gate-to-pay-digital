import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Pill } from "./primitives";
import { prefersReducedMotion } from "@/hooks/use-in-view";

export type StoryVisualKind = "challenge" | "platform" | "result";

export interface StoryStep {
  eyebrow: string;
  title: string;
  body: string;
  visual?: StoryVisualKind;
}

interface StoryScrollProps {
  heading: string;
  steps: StoryStep[];
  className?: string;
}

function StoryVisual({ kind, className }: { kind?: StoryVisualKind; className?: string }) {
  if (!kind) return null;
  const stroke = "var(--color-story-foreground)";
  const primary = "var(--color-primary)";

  if (kind === "challenge") {
    // Tangled cluster: five nodes with crossing curves
    return (
      <svg viewBox="0 0 320 130" className={cn("w-full max-w-[320px] h-auto", className)} aria-hidden>
        <g fill="none" stroke={stroke} strokeOpacity="0.35" strokeWidth="1.25">
          <path d="M 40 30 C 120 20 200 110 280 100" />
          <path d="M 40 100 C 130 110 200 30 280 30" />
          <path d="M 40 30 C 120 90 200 40 280 100" />
          <path d="M 40 100 C 140 40 220 90 280 30" />
          <path d="M 40 65 C 120 65 200 65 280 65" />
        </g>
        {[
          [40, 30], [40, 100], [40, 65], [160, 65], [280, 30], [280, 100], [280, 65],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={i === 3 ? 5 : 3.5}
            fill={i === 3 ? primary : stroke}
            fillOpacity={i === 3 ? 1 : 0.55}
          />
        ))}
      </svg>
    );
  }

  if (kind === "platform") {
    // Central hub with clean radial spokes to four nodes
    const rails = [
      [280, 20],
      [280, 65],
      [280, 110],
      [280, 155 - 20],
    ];
    return (
      <svg viewBox="0 0 320 130" className={cn("w-full max-w-[320px] h-auto", className)} aria-hidden>
        <circle cx="80" cy="65" r="34" fill="none" stroke={primary} strokeOpacity="0.35" strokeWidth="1" />
        <circle cx="80" cy="65" r="18" fill={primary} fillOpacity="0.15" stroke={primary} strokeWidth="1.25" />
        {rails.map(([x, y], i) => (
          <g key={i}>
            <path
              d={`M 98 65 C 170 65 190 ${y} 260 ${y}`}
              fill="none"
              stroke={stroke}
              strokeOpacity="0.45"
              strokeWidth="1.25"
            />
            <rect x="260" y={y - 8} width="46" height="16" rx="4" fill="none" stroke={stroke} strokeOpacity="0.4" />
          </g>
        ))}
      </svg>
    );
  }

  // result: ascending bars with underline
  const bars = [
    { x: 20, h: 30 },
    { x: 90, h: 55 },
    { x: 160, h: 80 },
    { x: 230, h: 108 },
  ];
  return (
    <svg viewBox="0 0 320 130" className={cn("w-full max-w-[320px] h-auto", className)} aria-hidden>
      <line x1="10" y1="120" x2="310" y2="120" stroke={primary} strokeOpacity="0.55" strokeWidth="1.5" />
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={120 - b.h}
          width="46"
          height={b.h}
          rx="4"
          fill={i === bars.length - 1 ? primary : stroke}
          fillOpacity={i === bars.length - 1 ? 0.9 : 0.28}
        />
      ))}
    </svg>
  );
}

export function StoryScroll({ heading, steps, className }: StoryScrollProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = el.offsetHeight - vh;
        const progressed = Math.min(Math.max(-rect.top / total, 0), 1);
        const idx = Math.min(steps.length - 1, Math.floor(progressed * steps.length));
        setActive(idx);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, steps.length]);

  if (reduced || isMobile) {
    return (
      <section
        className={cn("px-4 sm:px-6 py-14 sm:py-20", className)}
        style={{ backgroundColor: "var(--color-story)", color: "var(--color-story-foreground)" }}
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-h1" style={{ color: "var(--color-story-foreground)" }}>{heading}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={i} className="rounded-card border border-white/10 p-6">
                <Pill tone="primary" className="mb-3">{s.eyebrow}</Pill>
                <h3 className="text-h3" style={{ color: "var(--color-story-foreground)" }}>{s.title}</h3>
                <p className="mt-2 text-body-sm opacity-80">{s.body}</p>
                {s.visual && <StoryVisual kind={s.visual} className="mt-6 opacity-90" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={wrapRef}
      className={cn("relative", className)}
      style={{
        backgroundColor: "var(--color-story)",
        color: "var(--color-story-foreground)",
        minHeight: `${steps.length * 100}vh`,
      }}
    >
      <div className="sticky top-0 h-screen flex items-center ps-6 pe-6">
        <div className="mx-auto max-w-6xl w-full grid gap-12 md:grid-cols-[1fr_1.2fr] items-center">
          <div>
            <h2 className="text-h1" style={{ color: "var(--color-story-foreground)" }}>{heading}</h2>
            <div className="mt-8 flex gap-2">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-pill transition-colors duration-500",
                    i <= active ? "bg-primary" : "bg-white/15",
                  )}
                />
              ))}
            </div>
          </div>
          <div className="relative h-full min-h-[460px] flex items-center">
            {steps.map((s, i) => (
              <div
                key={i}
                aria-hidden={i !== active}
                className="absolute inset-0 flex flex-col justify-center transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
              >
                <Pill tone="primary" className="mb-4 self-start">{s.eyebrow}</Pill>
                <h3 className="text-h2" style={{ color: "var(--color-story-foreground)" }}>{s.title}</h3>
                <p className="mt-4 text-body-lg opacity-85 max-w-xl">{s.body}</p>
                {s.visual && <StoryVisual kind={s.visual} className="mt-10 opacity-90" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
