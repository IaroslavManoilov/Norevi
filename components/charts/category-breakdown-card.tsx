"use client";

import { useEffect, useRef, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/i18n-provider";
import { NO_DATA_KEY, UNCATEGORIZED_KEY } from "@/features/shared/domain/analytics-keys";

const colors = ["#1F8084", "#4FB0B0", "#7CC8C3", "#B9E1DA", "#176A71", "#28989A"];

export function CategoryBreakdownCard({ data }: { data: { name: string; amount: number }[] }) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const normalized = data.map((item) => ({
    ...item,
    name:
      item.name === NO_DATA_KEY
        ? t.common.noData
        : item.name === UNCATEGORIZED_KEY
          ? t.forms.categoryNone
          : item.name,
  }));

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const element = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      setReady(Boolean(rect && rect.width > 0 && rect.height > 0));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-[var(--text)]">{t.dashboard.topCategories}</p>
      <div ref={containerRef} className="h-56 w-full min-w-0">
        {normalized.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-[14px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] text-sm text-[var(--text-muted)]">
            {t.dashboard.topCategories}
          </div>
        ) : mounted && ready ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <PieChart>
              <Pie data={normalized} dataKey="amount" nameKey="name" innerRadius={44} outerRadius={72}>
                {normalized.map((entry, idx) => (
                  <Cell key={entry.name} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </Card>
  );
}
