import { useEffect, useState, type RefObject } from "react";

interface Options {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * Observe whether a ref'd element is in the viewport.
 * Returns `true` immediately when IntersectionObserver is unavailable (SSR/older UAs)
 * so content isn't hidden.
 */
export function useInView<T extends Element>(ref: RefObject<T | null>, opts: Options = {}): boolean {
  const { rootMargin = "0px 0px -10% 0px", threshold = 0.1, once = true } = opts;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold, once]);

  return inView;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
