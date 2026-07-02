import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "secondary";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const sizes: Record<Size, string> = {
  sm: "text-sm ps-3 pe-3 py-2",
  md: "text-[15px] ps-5 pe-5 py-2.5",
  lg: "text-base ps-6 pe-6 py-3",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground font-medium shadow-glow-sm hover:shadow-glow hover:brightness-110 active:brightness-95 transition-[filter,box-shadow] duration-200",
  ghost:
    "bg-transparent text-foreground border border-border hover:border-border-strong hover:bg-glass transition-colors duration-200",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-button whitespace-nowrap select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
