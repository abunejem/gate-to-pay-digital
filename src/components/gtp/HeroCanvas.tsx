import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const HeroConstellation = lazy(() => import("./HeroConstellation"));

function StaticFallback({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={{
        background:
          "radial-gradient(1000px 600px at 72% 40%, rgba(34,227,255,0.18), transparent 60%), radial-gradient(700px 500px at 15% 80%, rgba(10,138,169,0.16), transparent 60%)",
      }}
    >
      <svg
        className="absolute left-[68%] top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60"
        width="360"
        height="360"
        viewBox="0 0 360 360"
        fill="none"
      >
        <defs>
          <radialGradient id="hcore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22E3FF" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#22E3FF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#22E3FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="180" cy="180" r="140" fill="url(#hcore)" />
        <circle cx="180" cy="180" r="70" fill="#0A8AA9" fillOpacity="0.8" />
        <circle cx="180" cy="180" r="95" stroke="#22E3FF" strokeOpacity="0.4" fill="none" />
      </svg>
    </div>
  );
}

function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useVariant(): "mobile" | "desktop" {
  const [variant, setVariant] = useState<"mobile" | "desktop">("desktop");
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const update = () => setVariant(mql.matches ? "mobile" : "desktop");
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return variant;
}

export interface HeroCanvasProps {
  className?: string;
}

export function HeroCanvas({ className }: HeroCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const variant = useVariant();
  const webgl = useMemo(() => hasWebGL(), [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setActive(e.isIntersecting);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  return (
    <div ref={wrapRef} className={cn("pointer-events-none", className)}>
      {mounted && webgl ? (
        <Suspense fallback={<StaticFallback className="absolute inset-0" />}>
          <HeroConstellation active={active} reduced={reduced} variant={variant} />
        </Suspense>
      ) : (
        <StaticFallback className="absolute inset-0" />
      )}
    </div>
  );
}

export default HeroCanvas;
