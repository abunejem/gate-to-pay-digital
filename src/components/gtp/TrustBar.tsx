import { ShieldCheck, CreditCard, Landmark, Globe2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Pill } from "./primitives";

export function TrustBar({ className }: { className?: string }) {
  const t = useT();
  const items = [
    { Icon: Landmark, label: t("trust.cbj") },
    { Icon: CreditCard, label: t("trust.mastercard") },
    { Icon: ShieldCheck, label: t("trust.visa") },
    { Icon: Globe2, label: t("trust.unionpay") },
  ];
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {items.map(({ Icon, label }) => (
          <Pill key={label}>
            <Icon size={13} strokeWidth={2.2} className="text-primary" />
            {label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
