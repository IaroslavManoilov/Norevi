"use client";

import { useMemo, useState } from "react";
import { Bell, BellRing, CircleCheckBig, Sparkles } from "lucide-react";
import type { Bill, Reminder } from "@/types/domain";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type Language = "ru" | "en" | "ro";
type PushState = "unknown" | "enabled" | "blocked" | "unsupported";

const copy = {
  ru: {
    title: "Push-центр",
    subtitle: "Умные напоминания по платежам и делам прямо на телефоне",
    enable: "Включить push",
    test: "Тест push",
    digest: "Отправить умную сводку",
    enabled: "Push активны",
    blocked: "Push заблокированы",
    unsupported: "Браузер не поддерживает push",
    soonBills: "Платежи скоро",
    activeReminders: "Активные напоминания",
    digestSent: "Умная сводка отправлена",
    digestEmpty: "Сейчас нет срочных задач",
  },
  en: {
    title: "Push Center",
    subtitle: "Smart payment and life reminders delivered to your phone",
    enable: "Enable push",
    test: "Test push",
    digest: "Send smart digest",
    enabled: "Push enabled",
    blocked: "Push blocked",
    unsupported: "Browser does not support push",
    soonBills: "Bills due soon",
    activeReminders: "Active reminders",
    digestSent: "Smart digest sent",
    digestEmpty: "No urgent items right now",
  },
  ro: {
    title: "Centru Push",
    subtitle: "Memento inteligente pentru plati si rutina zilnica pe telefon",
    enable: "Activeaza push",
    test: "Test push",
    digest: "Trimite rezumat smart",
    enabled: "Push activ",
    blocked: "Push blocat",
    unsupported: "Browserul nu suporta push",
    soonBills: "Plati apropiate",
    activeReminders: "Memento active",
    digestSent: "Rezumatul smart a fost trimis",
    digestEmpty: "Nu exista urgente acum",
  },
} as const;

function isDueSoon(isoDate: string, hours: number) {
  const now = Date.now();
  const time = new Date(isoDate).getTime();
  return time >= now && time <= now + hours * 60 * 60 * 1000;
}

async function sendNotification(title: string, body: string, tag: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    await registration.showNotification(title, { body, tag });
    return;
  }
  new Notification(title, { body, tag });
}

export function PushCenterCard({
  bills,
  reminders,
  language = "en",
}: {
  bills: Bill[];
  reminders: Reminder[];
  language?: Language;
}) {
  const t = copy[language] ?? copy.en;
  const toast = useToast();
  const [pushState, setPushState] = useState<PushState>(() => {
    if (typeof window === "undefined") return "unknown";
    if (!("Notification" in window)) return "unsupported";
    if (Notification.permission === "granted") return "enabled";
    if (Notification.permission === "denied") return "blocked";
    return "unknown";
  });

  const dueSoonBills = useMemo(
    () => bills.filter((item) => item.status !== "paid" && isDueSoon(item.due_date, 24)),
    [bills]
  );
  const activeReminders = useMemo(
    () => reminders.filter((item) => item.status === "active"),
    [reminders]
  );

  async function requestPushPermission() {
    if (!("Notification" in window)) {
      setPushState("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setPushState("enabled");
      toast.show(t.enabled);
      return;
    }
    if (permission === "denied") {
      setPushState("blocked");
      toast.show(t.blocked);
      return;
    }
    setPushState("unknown");
  }

  async function sendTestPush() {
    await sendNotification("Norevi LifeSync", t.subtitle, "norevi-test");
  }

  async function sendSmartDigest() {
    if (!dueSoonBills.length && !activeReminders.length) {
      toast.show(t.digestEmpty);
      return;
    }
    const topBill = dueSoonBills[0];
    const topReminder = activeReminders[0];

    if (topBill) {
      await sendNotification("Norevi: Bill due soon", `${topBill.title} • ${topBill.amount}`, `bill-${topBill.id}`);
    }
    if (topReminder) {
      await sendNotification("Norevi: Reminder", topReminder.title, `reminder-${topReminder.id}`);
    }

    toast.show(t.digestSent);
  }

  const statusText =
    pushState === "enabled"
      ? t.enabled
      : pushState === "blocked"
        ? t.blocked
        : pushState === "unsupported"
          ? t.unsupported
          : t.enable;

  return (
    <Card className="border-[var(--brand-200)] bg-[linear-gradient(135deg,var(--brand-50),var(--surface))]">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--brand-700)]">{t.title}</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">{t.subtitle}</p>
          </div>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--brand-100)] text-[var(--brand-700)]">
            <BellRing size={18} />
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
            <p className="text-xs text-[var(--text-muted)]">{t.soonBills}</p>
            <p className="text-lg font-semibold text-[var(--text)]">{dueSoonBills.length}</p>
          </div>
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
            <p className="text-xs text-[var(--text-muted)]">{t.activeReminders}</p>
            <p className="text-lg font-semibold text-[var(--text)]">{activeReminders.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" className="h-10 gap-1.5" onClick={requestPushPermission}>
            <Bell size={14} />
            {t.enable}
          </Button>
          <Button type="button" variant="secondary" className="h-10 gap-1.5" onClick={sendSmartDigest}>
            <Sparkles size={14} />
            {t.digest}
          </Button>
          <Button type="button" variant="ghost" className="h-10 gap-1.5" onClick={sendTestPush}>
            <CircleCheckBig size={14} />
            {t.test}
          </Button>
        </div>

        <p className="text-xs text-[var(--text-muted)]">{statusText}</p>
      </div>
    </Card>
  );
}
