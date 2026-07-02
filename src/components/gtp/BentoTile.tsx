import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BentoTileProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function BentoTile({ children, className, interactive = true, ...rest }: BentoTileProps) {
  return (
    <div
      className={cn(
        "relative rounded-card p-6 md:p-8 bg-elevated border border-border transition-[transform,box-shadow,border-color] duration-300",
        "dark:bg-glass dark:backdrop-blur-xl",
        interactive &&
          "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-soft dark:hover:neon-edge",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
