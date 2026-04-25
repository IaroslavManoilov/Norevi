import Link from "next/link";
import { Activity, Brain, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/formatters";
import { getTranslations } from "@/lib/i18n/translations";
import { NO_DATA_KEY, UNCATEGORIZED_KEY } from "@/features/shared/domain/analytics-keys";

interface FlowInsightsProps {
  currency: string;
  avgPerDay: number;
  changePercent: number;
  topCategoryName: string;
  topCategoryAmount: number;
  focusScore: number;
  language?: "ru" | "en" | "ro";
  labels?: {
    section: string;
    title: string;
    subtitle: string;
    avgPerDay: string;
    trendMonth: string;
    flowScore: string;
    trendUnderControl: string;
    trendGrowing: string;
    topCategory: string;
    open: string;
  };
}

export function FlowInsightsCard({
  currency,
  avgPerDay,
  changePercent,
  topCategoryName,
  topCategoryAmount,
  focusScore,
  language = "en",
  labels,
}: FlowInsightsProps) {
  const t = getTranslations(language);
  const resolved = labels ?? {
    section: t.dashboard.flowMode,
    title: t.dashboard.flowAnalytics,
    subtitle: t.dashboard.flowAnalyticsDesc,
    avgPerDay: t.dashboard.avgPerDay,
    trendMonth: t.dashboard.trendMonth,
    flowScore: t.dashboard.flowScore,
    trendUnderControl: t.dashboard.trendUnderControl,
    trendGrowing: t.dashboard.trendGrowing,
    topCategory: t.dashboard.topCategoryMonth,
    open: t.actions.open,
  };
  const trendLabel = changePercent <= 0 ? resolved.trendUnderControl : resolved.trendGrowing;
  const displayCategory =
    topCategoryName === NO_DATA_KEY
      ? t.common.noData
      : topCategoryName === UNCATEGORIZED_KEY
        ? t.forms.categoryNone
        : topCategoryName;
  const tiles = [
    { key: "avg", label: resolved.avgPerDay, value: formatMoney(avgPerDay, currency, language), icon: Activity, tone: "brand" as const },
    { key: "trend", label: resolved.trendMonth, value: trendLabel, sub: `${changePercent.toFixed(1)}%`, icon: Target, tone: "mint" as const },
    { key: "score", label: resolved.flowScore, value: `${focusScore}/100`, icon: Brain, tone: "soft" as const },
  ];
  const tileToneClasses: Record<(typeof tiles)[number]["tone"], string> = {
    brand: "border-[var(--brand-200)] bg-[var(--brand-100)] text-[var(--brand-900)]",
    mint: "border-[var(--mint-200)] bg-[var(--mint-100)] text-[var(--brand-900)]",
    soft: "border-[var(--brand-200)] bg-[var(--brand-50)] text-[var(--brand-900)]",
  };

  return (
    <Card className="min-h-[200px]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--brand-700)]">{resolved.section}</p>
          <h3 className="text-xl font-bold text-[var(--text)]">{resolved.title}</h3>
          <p className="text-sm text-[var(--text-soft)]">{resolved.subtitle}</p>
        </div>
        <Link href="/finance" className="text-sm font-medium text-[var(--brand-700)]">
          {resolved.open}
        </Link>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.key}
              className={[
                "rounded-[14px] border p-3",
                tileToneClasses[tile.tone],
                "dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)] dark:text-[var(--text-dark)]",
              ].join(" ")}
            >
              <div
                className={[
                  "mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full",
                  "bg-[var(--brand-200)] text-[var(--brand-800)] dark:bg-[var(--surface-dark)] dark:text-[var(--brand-200)]",
                ].join(" ")}
              >
                <Icon size={16} />
              </div>
              <p className="text-xs text-[var(--text-soft)] dark:text-[var(--text-muted)]">{tile.label}</p>
              <p className="text-sm font-semibold text-[var(--brand-900)] dark:text-[var(--text)]">{tile.value}</p>
              {tile.sub ? <p className="text-xs text-[var(--text-soft)] dark:text-[var(--text-muted)]">{tile.sub}</p> : null}
            </div>
          );
        })}
      </div>

      <div className="mt-3 rounded-[14px] border border-[var(--brand-200)] bg-[var(--brand-50)] p-3 text-[var(--brand-900)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)] dark:text-[var(--text)]">
        <p className="text-xs text-[var(--text-soft)] dark:text-[var(--text-muted)]">{resolved.topCategory}</p>
        <p className="text-sm font-semibold text-[var(--brand-900)] dark:text-[var(--text)]">
          {displayCategory} · {formatMoney(topCategoryAmount, currency, language)}
        </p>
      </div>
    </Card>
  );
}

export function FlowPlanCard({
  activeDays,
  labels,
  language = "en",
}: {
  activeDays: number;
  labels?: {
    section: string;
    title: string;
    subtitle: string;
    activeDays: string;
    recommendation: string;
  };
  language?: "ru" | "en" | "ro";
}) {
  const t = getTranslations(language);
  const resolved = labels ?? {
    section: t.dashboard.flowMode,
    title: t.dashboard.flowPlan,
    subtitle: t.dashboard.flowPlanDesc,
    activeDays: t.dashboard.flowDays,
    recommendation: t.dashboard.flowRecommendation,
  };
  return (
    <Card className="min-h-[260px] bg-[var(--surface)]">
      <p className="text-sm font-semibold text-[var(--brand-700)]">{resolved.section}</p>
      <h3 className="mt-1 text-[32px] leading-none font-bold tracking-tight text-[var(--text)] sm:text-[44px]">
        {resolved.title}
      </h3>
      <p className="mt-2 text-sm text-[var(--text-soft)]">{resolved.subtitle}</p>
      <div className="mt-4 rounded-[14px] border border-[var(--brand-200)] bg-[var(--brand-100)] p-3 text-sm text-[var(--brand-900)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)] dark:text-[var(--text-soft)]">
        {resolved.activeDays}:{" "}
        <span className="font-semibold text-[var(--brand-900)] dark:text-[var(--text)]">{activeDays}</span>
      </div>
      <div className="mt-4 rounded-[14px] border border-[var(--mint-200)] bg-[var(--mint-100)] p-3 text-sm leading-relaxed text-[var(--text-soft)] dark:border-transparent dark:bg-transparent dark:text-[var(--text-soft)]">
        {resolved.recommendation}
      </div>
    </Card>
  );
}
