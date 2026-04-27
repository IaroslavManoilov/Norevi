"use client";

import { useEffect } from "react";

type BillLite = {
  id: string;
  title: string;
  due_date: string;
  status: "upcoming" | "paid" | "overdue";
  amount: number;
};

type ReminderLite = {
  id: string;
  title: string;
  remind_at: string;
  status: "active" | "done" | "cancelled";
};

function dueInHours(isoDate: string, hours: number) {
  const now = Date.now();
  const date = new Date(isoDate).getTime();
  return date >= now && date <= now + hours * 60 * 60 * 1000;
}

async function showPush(title: string, body: string, tag: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    await registration.showNotification(title, { body, tag });
    return;
  }
  new Notification(title, { body, tag });
}

function shouldNotifyOnce(key: string) {
  const storageKey = `norevi-notify-once:${key}`;
  if (window.localStorage.getItem(storageKey)) return false;
  window.localStorage.setItem(storageKey, "1");
  return true;
}

async function runSmartNudges() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const [billsRes, remindersRes] = await Promise.all([
    fetch("/api/bills", { cache: "no-store" }),
    fetch("/api/reminders", { cache: "no-store" }),
  ]);
  if (!billsRes.ok || !remindersRes.ok) return;

  const billsData = (await billsRes.json()) as { data?: BillLite[] };
  const remindersData = (await remindersRes.json()) as { data?: ReminderLite[] };
  const bills = billsData.data ?? [];
  const reminders = remindersData.data ?? [];

  for (const bill of bills) {
    const overdue = bill.status === "overdue";
    const soon = bill.status !== "paid" && dueInHours(bill.due_date, 20);
    if (!overdue && !soon) continue;
    const key = `bill:${bill.id}:${bill.due_date}`;
    if (!shouldNotifyOnce(key)) continue;
    await showPush(
      overdue ? "Norevi: Overdue bill" : "Norevi: Bill due soon",
      `${bill.title} • ${bill.amount}`,
      key
    );
  }

  for (const reminder of reminders) {
    if (reminder.status !== "active" || !dueInHours(reminder.remind_at, 2)) continue;
    const key = `reminder:${reminder.id}:${reminder.remind_at}`;
    if (!shouldNotifyOnce(key)) continue;
    await showPush("Norevi: Reminder", reminder.title, key);
  }
}

export function PushNudges() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    void runSmartNudges();
    const timer = window.setInterval(() => {
      void runSmartNudges();
    }, 90 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  return null;
}
