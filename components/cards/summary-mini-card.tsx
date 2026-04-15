import { formatMoney } from "@/lib/formatters";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function SummaryMiniCard({
  title,
  value,
  currency,
  language = "en",
  className,
}: {
  title: string;
  value: number;
  currency: string;
  language?: "ru" | "en" | "ro";
  className?: string;
}) {
  return (
    <Card className={cn("min-h-[120px] sm:min-h-[148px]", className)}>
      <p className="text-sm font-medium text-[var(--text-soft)]">{title}</p>
      <p className="mt-3 max-w-full text-[clamp(1.4rem,1.75vw,1.95rem)] leading-tight font-semibold tracking-tight text-[var(--text)] [font-variant-numeric:tabular-nums] [word-break:keep-all]">
        {formatMoney(value, currency, language)}
      </p>
    </Card>
  );
}
