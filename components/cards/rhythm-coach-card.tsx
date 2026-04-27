"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BellRing, CalendarClock, Sparkles, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { RhythmLanguage, RhythmTask } from "@/lib/utils/rhythm";

type Labels = {
  title: string;
  subtitle: string;
  rhythmScore: string;
  focusNow: string;
  enablePush: string;
  pushEnabled: string;
  pushBlocked: string;
  pushUnsupported: string;
  testPush: string;
  reminderFromTask: string;
  reminderCreated: string;
  reminderFailed: string;
  openTask: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  noTasks: string;
};

type PushState = "unknown" | "enabled" | "blocked" | "unsupported";

function iconForKind(kind: RhythmTask["kind"]) {
  if (kind === "bill") return <Wallet size={15} />;
  if (kind === "reminder") return <BellRing size={15} />;
  if (kind === "finance") return <CalendarClock size={15} />;
  return <Sparkles size={15} />;
}

export function RhythmCoachCard({
  language,
  score,
  focusText,
  tasks,
}: {
  language: RhythmLanguage;
  score: number;
  focusText: string;
  tasks: RhythmTask[];
}) {
  const toast = useToast();
  const [pushState, setPushState] = useState<PushState>(() => {
    if (typeof window === "undefined") return "unknown";
    if (!("Notification" in window)) return "unsupported";
    if (Notification.permission === "granted") return "enabled";
    if (Notification.permission === "denied") return "blocked";
    return "unknown";
  });
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

  const labels = useMemo<Labels>(() => {
    if (language === "ru") {
      return {
        title: "Rhythm Coach",
        subtitle: "Один умный поток: платежи, календарь, финансы и фокус",
        rhythmScore: "Rhythm score",
        focusNow: "Фокус на сейчас",
        enablePush: "Включить push",
        pushEnabled: "Push включены",
        pushBlocked: "Push заблокированы в браузере",
        pushUnsupported: "Этот браузер не поддерживает push",
        testPush: "Тест push",
        reminderFromTask: "Сделать напоминание",
        reminderCreated: "Напоминание создано.",
        reminderFailed: "Не удалось создать напоминание.",
        openTask: "Открыть",
        priorityHigh: "Высокий",
        priorityMedium: "Средний",
        priorityLow: "Низкий",
        noTasks: "На сейчас критичных задач нет. Отличный ритм.",
      };
    }
    if (language === "ro") {
      return {
        title: "Rhythm Coach",
        subtitle: "Un singur flux: plati, calendar, finante si focus",
        rhythmScore: "Rhythm score",
        focusNow: "Focus acum",
        enablePush: "Activeaza push",
        pushEnabled: "Push activ",
        pushBlocked: "Push blocat in browser",
        pushUnsupported: "Acest browser nu suporta push",
        testPush: "Test push",
        reminderFromTask: "Creeaza memento",
        reminderCreated: "Memento creat.",
        reminderFailed: "Nu s-a putut crea memento.",
        openTask: "Deschide",
        priorityHigh: "Inalt",
        priorityMedium: "Mediu",
        priorityLow: "Scazut",
        noTasks: "Nu exista sarcini critice acum. Ritm bun.",
      };
    }
    return {
      title: "Rhythm Coach",
      subtitle: "One smart flow: bills, calendar, finance, and daily focus",
      rhythmScore: "Rhythm score",
      focusNow: "Focus now",
      enablePush: "Enable push",
      pushEnabled: "Push enabled",
      pushBlocked: "Push is blocked in browser",
      pushUnsupported: "This browser does not support push",
      testPush: "Test push",
      reminderFromTask: "Create reminder",
      reminderCreated: "Reminder created.",
      reminderFailed: "Failed to create reminder.",
      openTask: "Open",
      priorityHigh: "High",
      priorityMedium: "Medium",
      priorityLow: "Low",
      noTasks: "No critical tasks right now. Great rhythm.",
    };
  }, [language]);

  async function requestPushPermission() {
    if (!("Notification" in window)) {
      setPushState("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setPushState("enabled");
      toast.show(labels.pushEnabled);
      return;
    }
    if (permission === "denied") {
      setPushState("blocked");
      toast.show(labels.pushBlocked);
      return;
    }
    setPushState("unknown");
  }

  async function sendTestNotification() {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    new Notification("Norevi LifeSync", { body: focusText });
  }

  async function createReminderFromTask(task: RhythmTask) {
    setPendingTaskId(task.id);
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          remind_at: task.suggestReminderAt,
          repeat_type: "none",
          priority: task.priority === "high" ? "high" : "medium",
          status: "active",
        }),
      });
      if (!response.ok) {
        toast.show(labels.reminderFailed);
        return;
      }
      toast.show(labels.reminderCreated);
    } catch {
      toast.show(labels.reminderFailed);
    } finally {
      setPendingTaskId(null);
    }
  }

  const pushStatusText =
    pushState === "enabled"
      ? labels.pushEnabled
      : pushState === "blocked"
        ? labels.pushBlocked
        : pushState === "unsupported"
          ? labels.pushUnsupported
          : labels.enablePush;

  return (
    <Card className="border-[var(--brand-200)] bg-[linear-gradient(135deg,var(--brand-50),var(--surface))]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--brand-700)]">{labels.title}</p>
            <h2 className="mt-1 text-xl font-bold text-[var(--text)]">{labels.subtitle}</h2>
          </div>
          <div className="rounded-[14px] border border-[var(--brand-200)] bg-[var(--surface)] px-3 py-2 text-right">
            <p className="text-xs text-[var(--text-muted)]">{labels.rhythmScore}</p>
            <p className="text-2xl font-bold text-[var(--brand-800)]">{score}</p>
          </div>
        </div>

        <div className="rounded-[14px] border border-[var(--brand-200)] bg-[var(--surface)] px-3 py-3">
          <p className="text-xs font-semibold text-[var(--text-muted)]">{labels.focusNow}</p>
          <p className="mt-1 text-sm font-medium text-[var(--text)]">{focusText}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant={pushState === "enabled" ? "secondary" : "primary"} onClick={requestPushPermission}>
            {labels.enablePush}
          </Button>
          <Button type="button" variant="ghost" onClick={sendTestNotification} disabled={pushState !== "enabled"}>
            {labels.testPush}
          </Button>
          <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--text-soft)]">
            {pushStatusText}
          </span>
        </div>

        <div className="space-y-2">
          {tasks.length ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-3 py-3 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-100)] text-[var(--brand-800)]">
                        {iconForKind(task.kind)}
                      </span>
                      <p className="truncate text-sm font-semibold text-[var(--text)]">{task.title}</p>
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-soft)]">{task.description}</p>
                    <p className="mt-2 text-[11px] font-semibold text-[var(--brand-700)]">
                      {task.priority === "high"
                        ? labels.priorityHigh
                        : task.priority === "medium"
                          ? labels.priorityMedium
                          : labels.priorityLow}
                    </p>
                  </div>
                  <Link
                    href={task.href}
                    className="rounded-full border border-[var(--brand-300)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--brand-800)]"
                  >
                    {labels.openTask}
                  </Link>
                </div>
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-9 text-xs"
                    disabled={pendingTaskId === task.id}
                    onClick={() => createReminderFromTask(task)}
                  >
                    {labels.reminderFromTask}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--text-muted)]">{labels.noTasks}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
