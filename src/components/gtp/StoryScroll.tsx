import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Pill } from "./primitives";
import { prefersReducedMotion } from "@/hooks/use-in-view";

export interface StoryStep {
  eyebrow: string;
  title: string;
  body: string;
  image: { url: string };
  imageAlt: string;
  overlayStat?: { label: string };
}

interface StoryScrollProps {
  heading: string;
  steps: StoryStep[];
  className?: string;
}

const IMAGE_SHADOW =
  "0 0 0 1px rgba(34,227,255,0.15), 0 0 60px -10px rgba(34,227,255,0.35), inset 0 0 40px rgba(34,227,255,0.08)";

function StoryImage({ step, className }: { step: StoryStep; className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-[16px] overflow-hidden border border-primary/25",
        className,
      )}
      style={{ boxShadow: IMAGE_SHADOW }}
    >
      <img
        src={step.image.url}
        alt={step.imageAlt}
        loading="lazy"
        decoding="async"
        className="w-full h-auto aspect-[4/3] object-cover"
      />
      {step.overlayStat && (
        <div className="absolute bottom-4 left-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-body-sm text-white shadow-lg">
          {step.overlayStat.label}
        </div>
      )}
    </div>
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
                <StoryImage step={s} className="mt-6" />
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
          <div className="relative h-full min-h-[520px] flex items-center">
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
                <StoryImage step={s} className="mt-8 max-w-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
