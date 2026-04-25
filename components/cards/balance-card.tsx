import { formatMoney } from "@/lib/formatters";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { getTranslations } from "@/lib/i18n/translations";

export function BalanceCard({
  balance,
  currency,
  language = "en",
  label,
  className,
}: {
  balance: number;
  currency: string;
  language?: "ru" | "en" | "ro";
  label?: string;
  className?: string;
}) {
  const t = getTranslations(language);
  const text = label ?? t.dashboard.balance;
  return (
    <Card className={cn("min-h-[120px] bg-[var(--brand-700)] text-white sm:min-h-[148px]", className)}>
      <p className="text-sm font-medium text-white/80">{text}</p>
      <p className="mt-3 max-w-full text-[clamp(1.45rem,1.85vw,2rem)] leading-tight font-semibold tracking-tight [font-variant-numeric:tabular-nums] [word-break:keep-all]">
        {formatMoney(balance, currency, language)}
      </p>
    </Card>
  );
}
