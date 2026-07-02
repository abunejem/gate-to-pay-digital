import { useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function Reveal({ as: Tag = "div", children, className, delay = 0, once = true }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once });
  return (
    <Tag
      ref={ref as never}
      className={cn("motion-reveal", className)}
      data-revealed={inView ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
