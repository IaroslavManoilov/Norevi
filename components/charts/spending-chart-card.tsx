"use client";

import { useEffect, useRef, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/i18n-provider";

export function SpendingChartCard({ data }: { data: { date: string; amount: number }[] }) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      <p className="mb-3 text-sm font-semibold text-[var(--text)]">{t.dashboard.spendingAnalytics}</p>
      <div ref={containerRef} className="h-56 w-full min-w-0">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-[14px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] text-sm text-[var(--text-muted)]">
            {t.dashboard.spendingAnalytics}
          </div>
        ) : mounted && ready ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <AreaChart data={data}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#176A71" fill="#DDF1EC" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </Card>
  );
}
