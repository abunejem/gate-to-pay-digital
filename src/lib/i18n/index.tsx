import { createContext, useContext, useMemo, type ReactNode } from "react";
import { en, type Dict } from "./en";

export type Locale = "en";
export type Direction = "ltr" | "rtl";

interface LocaleContextValue {
  locale: Locale;
  dir: Direction;
  t: (path: string) => string;
  dict: Dict;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function resolvePath(obj: unknown, path: string): string {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return path;
    }
  }
  return typeof cur === "string" ? cur : path;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const value = useMemo<LocaleContextValue>(() => {
    const dict = en;
    return {
      locale: "en",
      dir: "ltr",
      dict,
      t: (path: string) => resolvePath(dict, path),
    };
  }, []);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return { locale: "en", dir: "ltr", t: (p) => p, dict: en };
  }
  return ctx;
}

export function useT() {
  return useLocale().t;
}
