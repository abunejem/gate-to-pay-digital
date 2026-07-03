import { ShieldCheck, CreditCard, Landmark, Calendar } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Pill } from "./primitives";
import { cn } from "@/lib/utils";

export function TrustBar({ className, pillClassName }: { className?: string; pillClassName?: string }) {
  const t = useT();
  const items = [
    { Icon: Landmark, label: t("trust.cbj") },
    { Icon: CreditCard, label: t("trust.mastercard") },
    { Icon: ShieldCheck, label: t("trust.pcidss") },
    { Icon: Calendar, label: t("trust.since") },
  ];
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {items.map(({ Icon, label }) => (
          <Pill key={label} className={cn(pillClassName)}>
            <Icon size={13} strokeWidth={2.2} className="text-primary" />
            {label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
