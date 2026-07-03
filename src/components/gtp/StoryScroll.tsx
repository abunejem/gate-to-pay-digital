import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Pill } from "./primitives";
import { prefersReducedMotion } from "@/hooks/use-in-view";

export interface StoryStep {
  eyebrow: string;
  title: string;
  body: string;
}

interface StoryScrollProps {
  heading: string;
  steps: StoryStep[];
  className?: string;
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
        className={cn("ps-6 pe-6 py-20", className)}
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
          <div className="relative min-h-[280px]">
            {steps.map((s, i) => (
              <div
                key={i}
                aria-hidden={i !== active}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
              >
                <Pill tone="primary" className="mb-4">{s.eyebrow}</Pill>
                <h3 className="text-h2" style={{ color: "var(--color-story-foreground)" }}>{s.title}</h3>
                <p className="mt-4 text-body-lg opacity-85 max-w-xl">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
