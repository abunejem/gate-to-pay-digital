import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface ApiResponseCardProps {
  code: string;
  lang?: string;
  title?: string;
  className?: string;
}

export function ApiResponseCard({
  code,
  lang = "json",
  title = "200 OK · application/json",
  className,
}: ApiResponseCardProps) {
  const { resolvedTheme } = useTheme();
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang,
      theme: resolvedTheme === "dark" ? "github-dark-default" : "github-light",
    })
      .then((out) => {
        if (!cancelled) setHtml(out);
      })
      .catch(() => {
        if (!cancelled) setHtml(`<pre>${code}</pre>`);
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang, resolvedTheme]);

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-elevated overflow-hidden dark:bg-glass dark:backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border ps-4 pe-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="text-xs text-muted-foreground font-mono">{title}</span>
      </div>
      <div
        className="[&_pre]:!bg-transparent [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:overflow-x-auto [&_code]:font-mono"
        // shiki output is trusted (we generate it from static code prop)
        dangerouslySetInnerHTML={{ __html: html || `<pre><code>${code}</code></pre>` }}
      />
    </div>
  );
}
