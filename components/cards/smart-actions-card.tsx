"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { SmartAction, SmartActionsVariant } from "@/lib/utils/smart-actions";

const toneStyles: Record<SmartAction["tone"], string> = {
  danger: "border-[var(--danger)]/30 bg-[var(--danger)]/5",
  warning: "border-[var(--warning)]/30 bg-[var(--warning)]/5",
  success: "border-[var(--success)]/30 bg-[var(--success)]/5",
};

async function trackSmartActionEvent(payload: {
  action_id: string;
  event_type: "view" | "click" | "complete" | "dismiss";
  variant: SmartActionsVariant;
  position: number;
  score: number;
}) {
  try {
    await fetch("/api/smart-actions/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // fire-and-forget telemetry
  }
}

export function SmartActionsCard({
  section,
  title,
  subtitle,
  actions,
  openLabel,
  doneLabel,
  dismissLabel,
  whyLabel,
  variant,
}: {
  section: string;
  title: string;
  subtitle: string;
  actions: SmartAction[];
  openLabel: string;
  doneLabel: string;
  dismissLabel: string;
  whyLabel: string;
  variant: SmartActionsVariant;
}) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const visibleActions = useMemo(
    () => actions.filter((action) => !dismissedIds.includes(action.id)),
    [actions, dismissedIds]
  );

  useEffect(() => {
    visibleActions.forEach((action, index) => {
      void trackSmartActionEvent({
        action_id: action.id,
        event_type: "view",
        variant,
        position: index + 1,
        score: action.personalizedScore,
      });
    });
  }, [visibleActions, variant]);

  return (
    <Card className="relative overflow-hidden border-[var(--brand-200)] bg-[linear-gradient(135deg,var(--brand-50),var(--surface))]">
      <div className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-[var(--brand-200)]/30 blur-2xl" />
      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--brand-700)]">{section}</p>
            <h3 className="text-xl font-bold text-[var(--text)]">{title}</h3>
            <p className="text-sm text-[var(--text-soft)]">{subtitle}</p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--brand-100)] text-[var(--brand-800)]">
            <Sparkles size={18} />
          </span>
        </div>

        <div className="space-y-2.5">
          {visibleActions.map((action, index) => {
            const position = index + 1;
            const isCompleted = completedIds.includes(action.id);

            return (
              <div
                key={action.id}
                className={`rounded-[14px] border px-3 py-3 dark:border-[var(--border-dark)] ${toneStyles[action.tone]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)]">{action.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-soft)]">{action.description}</p>
                    <p className="mt-2 text-[11px] font-medium text-[var(--brand-700)]">
                      {whyLabel}: {action.why}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {action.metrics.map((metric) => (
                        <span
                          key={`${action.id}-${metric.label}`}
                          className="rounded-full border border-[var(--brand-300)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand-800)]"
                        >
                          {metric.label}: {metric.value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={action.href}
                    onClick={() => {
                      void trackSmartActionEvent({
                        action_id: action.id,
                        event_type: "click",
                        variant,
                        position,
                        score: action.personalizedScore,
                      });
                    }}
                    className="rounded-full border border-[var(--brand-300)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--brand-800)] hover:bg-[var(--brand-50)]"
                  >
                    {openLabel}
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isCompleted}
                    onClick={() => {
                      setCompletedIds((prev) => (prev.includes(action.id) ? prev : [...prev, action.id]));
                      void trackSmartActionEvent({
                        action_id: action.id,
                        event_type: "complete",
                        variant,
                        position,
                        score: action.personalizedScore,
                      });
                    }}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      isCompleted
                        ? "bg-[var(--success)]/20 text-[var(--success)]"
                        : "border border-[var(--brand-300)] bg-[var(--surface)] text-[var(--text-soft)]"
                    }`}
                  >
                    {doneLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDismissedIds((prev) => [...prev, action.id]);
                      void trackSmartActionEvent({
                        action_id: action.id,
                        event_type: "dismiss",
                        variant,
                        position,
                        score: action.personalizedScore,
                      });
                    }}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-muted)]"
                  >
                    {dismissLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
