import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "gtp-theme";

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Pre-hydration inline script. Runs before paint to prevent FOUC.
 * Reads localStorage; falls back to matchMedia(prefers-color-scheme).
 * Applies .dark or .light class on <html> and records data-theme-pref.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");var pref=(s==="light"||s==="dark"||s==="system")?s:"system";var isDark=pref==="dark"||(pref==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var el=document.documentElement;el.classList.toggle("dark",isDark);el.classList.toggle("light",!isDark);el.dataset.themePref=pref;}catch(e){document.documentElement.classList.add("dark");}})();`;

function readInitialPreference(): ThemePreference {
  if (typeof document === "undefined") return "system";
  const p = document.documentElement.dataset.themePref;
  if (p === "light" || p === "dark" || p === "system") return p;
  return "system";
}

function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === "light" || pref === "dark") return pref;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readInitialPreference());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(readInitialPreference()));

  // Apply class + persist on preference change
  useEffect(() => {
    const resolved = resolveTheme(preference);
    setResolvedTheme(resolved);
    const el = document.documentElement;
    el.classList.toggle("dark", resolved === "dark");
    el.classList.toggle("light", resolved === "light");
    el.dataset.themePref = preference;
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // ignore
    }
  }, [preference]);

  // Live-follow OS changes only while on "system"
  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const resolved: ResolvedTheme = e.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle("dark", resolved === "dark");
      document.documentElement.classList.toggle("light", resolved === "light");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  return (
    <ThemeContext.Provider value={{ preference, resolvedTheme, setPreference: setPreferenceState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback for SSR paths / unwrapped trees
    return { preference: "system", resolvedTheme: "dark", setPreference: () => {} };
  }
  return ctx;
}
