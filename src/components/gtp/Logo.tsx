import { useTheme } from "@/lib/theme";
import horizontal from "@/assets/logo-horizontal.svg";
import horizontalDark from "@/assets/logo-horizontal-dark.svg";
import vertical from "@/assets/logo-vertical.svg";
import verticalDark from "@/assets/logo-vertical-dark.svg";
import icon from "@/assets/logo-icon.svg";

interface LogoProps {
  variant?: "horizontal" | "vertical" | "icon";
  className?: string;
  height?: number;
}

export function Logo({ variant = "horizontal", className, height }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const src =
    variant === "icon"
      ? icon
      : variant === "vertical"
        ? isDark
          ? verticalDark
          : vertical
        : isDark
          ? horizontalDark
          : horizontal;
  return (
    <img
      src={src}
      alt="Gate to Pay"
      className={className}
      style={height ? { height, width: "auto" } : undefined}
    />
  );
}
