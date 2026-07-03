import { cn } from "@/lib/utils";
import { Pill } from "./primitives";
import { Reveal } from "./Reveal";

export interface StoryRow {
  eyebrow: string;
  title: string;
  body: string;
  image: { url: string };
  imageAlt: string;
  overlayStat?: { label: string };
}

interface StoryImageRowsProps {
  intro: string;
  rows: StoryRow[];
  className?: string;
}

export function StoryImageRows({ intro, rows, className }: StoryImageRowsProps) {
  return (
    <section
      className={cn("px-4 sm:px-6 py-24 sm:py-32", className)}
      style={{
        backgroundColor: "var(--color-story)",
        color: "var(--color-story-foreground)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-center text-h2 max-w-3xl mx-auto" style={{ color: "var(--color-story-foreground)" }}>
            {intro}
          </p>
        </Reveal>

        <div className="mt-20 sm:mt-28 space-y-24 sm:space-y-32">
          {rows.map((row, i) => {
            const imageRight = i % 2 === 1;
            return (
              <Reveal key={row.title} delay={80}>
                <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
                  {/* Image */}
                  <div className={cn("relative", imageRight && "md:order-2")}>
                    <div
                      className="relative rounded-[16px] overflow-hidden border border-primary/25"
                      style={{
                        boxShadow:
                          "0 0 0 1px rgba(34,227,255,0.15), 0 0 60px -10px rgba(34,227,255,0.35), inset 0 0 40px rgba(34,227,255,0.08)",
                      }}
                    >
                      <img
                        src={row.image.url}
                        alt={row.imageAlt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto aspect-[3/2] object-cover"
                      />
                      {row.overlayStat && (
                        <div className="absolute bottom-4 left-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-body-sm text-white shadow-lg">
                          {row.overlayStat.label}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text */}
                  <div className={cn(imageRight && "md:order-1")}>
                    <Pill tone="primary" className="mb-4">{row.eyebrow}</Pill>
                    <h3 className="text-h2" style={{ color: "var(--color-story-foreground)" }}>
                      {row.title}
                    </h3>
                    <p className="mt-5 text-body-lg opacity-85 max-w-md">{row.body}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
