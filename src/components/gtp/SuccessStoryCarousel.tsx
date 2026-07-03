import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/gtp/Button";
import { Pill } from "@/components/gtp/primitives";
import { cn } from "@/lib/utils";

export interface SuccessSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  metric?: { value: string; label: string };
  logo?: { src: string; alt: string };
  href: string;
  sample?: boolean;
}

interface SuccessStoryCarouselProps {
  slides: SuccessSlide[];
  autoAdvanceMs?: number;
  className?: string;
}

export function SuccessStoryCarousel({
  slides,
  autoAdvanceMs = 6000,
  className,
}: SuccessStoryCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const pausedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    setEnhanced(true);
    reducedMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Track active slide via IntersectionObserver
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { root: track, threshold: [0.6] },
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  const goTo = useCallback((idx: number) => {
    const track = trackRef.current;
    const target = slideRefs.current[idx];
    if (!track || !target) return;
    track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, []);

  const next = useCallback(
    () => goTo((active + 1) % slides.length),
    [active, slides.length, goTo],
  );
  const prev = useCallback(
    () => goTo((active - 1 + slides.length) % slides.length),
    [active, slides.length, goTo],
  );

  // Auto-advance
  useEffect(() => {
    if (!enhanced || reducedMotionRef.current || autoAdvanceMs <= 0) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      if (document.hidden) return;
      next();
    }, autoAdvanceMs);
    return () => clearInterval(id);
  }, [enhanced, autoAdvanceMs, next]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Customer success stories"
      className={cn("relative", className)}
      onKeyDown={onKeyDown}
      onPointerEnter={() => (pausedRef.current = true)}
      onPointerLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
    >
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth rounded-card [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        aria-live="polite"
      >
        {slides.map((s, i) => (
          <article
            key={s.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            data-index={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${s.title}`}
            aria-hidden={enhanced && i !== active ? "true" : undefined}
            className="min-w-full snap-center"
          >
            <div
              className="relative rounded-card p-6 sm:p-10 md:p-14 mx-0.5"
              style={{
                backgroundColor: "var(--color-story)",
                color: "var(--color-story-foreground)",
              }}
            >
              {s.sample && (
                <span
                  className="absolute top-4 right-4 uppercase tracking-wider text-[10px] font-semibold px-2 py-1 rounded-pill border border-current/40 opacity-70"
                  aria-label="Sample content, to verify"
                >
                  sample — to verify
                </span>
              )}

              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
                <div className="min-w-0">
                  <Pill tone="primary" className="mb-4">
                    {s.eyebrow}
                  </Pill>
                  <h3
                    className="text-h2"
                    style={{ color: "var(--color-story-foreground)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-body-lg opacity-85">
                    {s.body}
                  </p>
                  <div className="mt-8">
                    <a href={s.href} className="inline-block">
                      <Button variant="primary">
                        Read the story <ArrowRight size={16} />
                      </Button>
                    </a>
                  </div>
                </div>

                {(s.metric || s.logo) && (
                  <div className="flex md:flex-col items-start md:items-end gap-6 md:min-w-[180px] md:pt-2">
                    {s.logo && (
                      <img
                        src={s.logo.src}
                        alt={s.logo.alt}
                        className="h-10 w-auto opacity-90"
                      />
                    )}
                    {s.metric && (
                      <div className="md:text-right">
                        <div
                          className="text-4xl sm:text-5xl font-semibold leading-none"
                          style={{ color: "var(--color-story-foreground)" }}
                        >
                          {s.metric.value}
                        </div>
                        <div className="mt-2 text-sm opacity-75">
                          {s.metric.label}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {enhanced && slides.length > 1 && (
        <>
          <div className="mt-6 flex items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Select story"
              className="flex items-center gap-2"
            >
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-current={i === active ? "true" : undefined}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-2 rounded-pill transition-all duration-300",
                    i === active
                      ? "w-6 bg-foreground"
                      : "w-2 bg-foreground/30 hover:bg-foreground/60",
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous story"
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next story"
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
