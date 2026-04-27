"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/components/i18n/i18n-provider";
import { resolveLocale } from "@/lib/i18n/locale";
import { useToast } from "@/components/ui/toast";

type ReminderItem = {
  id: string;
  title: string;
  remind_at: string;
  status: string;
  priority?: "low" | "medium" | "high";
};

type NoteItem = {
  id: string;
  title: string;
  body?: string | null;
  note_date: string;
};

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseISODate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function formatDayMonthYear(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function ReminderCalendar({
  reminders,
  notes,
  language,
  showHeader = true,
  withCard = true,
  showHint = true,
}: {
  reminders: ReminderItem[];
  notes: NoteItem[];
  language: "ru" | "en" | "ro";
  showHeader?: boolean;
  withCard?: boolean;
  showHint?: boolean;
}) {
  const { t } = useI18n();
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState(() => new Date());
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [items, setItems] = useState<ReminderItem[]>(reminders);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteItems, setNoteItems] = useState<NoteItem[]>(notes);
  const [saving, setSaving] = useState(false);
  const locale = resolveLocale(language);
  const { show } = useToast();

  const dayFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short" }), [locale]);
  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);

  const weekDays = useMemo(() => {
    const monday = new Date(2021, 5, 7);
    return Array.from({ length: 7 }, (_, i) => dayFormatter.format(new Date(monday.getTime() + i * 86400000)));
  }, [dayFormatter]);

  const cells = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const first = new Date(year, monthIndex, 1);
    const last = new Date(year, monthIndex + 1, 0);
    const startOffset = (first.getDay() + 6) % 7;
    const total = Math.ceil((startOffset + last.getDate()) / 7) * 7;
    return Array.from({ length: total }, (_, i) => {
      const date = new Date(year, monthIndex, i - startOffset + 1);
      return date;
    });
  }, [month]);

  const reminderMap = useMemo(() => {
    const map = new Map<string, ReminderItem[]>();
    items.forEach((item) => {
      const key = toDateKey(parseISODate(item.remind_at));
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    });
    return map;
  }, [items]);

  const noteMap = useMemo(() => {
    const map = new Map<string, NoteItem[]>();
    noteItems.forEach((item) => {
      const key = item.note_date;
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    });
    return map;
  }, [noteItems]);

  const reminderPriorityMap = useMemo(() => {
    const rank = (value?: ReminderItem["priority"]) => (value === "high" ? 3 : value === "medium" ? 2 : 1);
    const map = new Map<string, ReminderItem["priority"]>();
    reminderMap.forEach((list, key) => {
      const top = list.reduce((acc, item) => (rank(item.priority) > rank(acc) ? item.priority : acc), "low" as ReminderItem["priority"]);
      map.set(key, top);
    });
    return map;
  }, [reminderMap]);

  const selectedKey = toDateKey(selected);
  const selectedReminders = reminderMap.get(selectedKey) ?? [];
  const selectedNotes = noteMap.get(selectedKey) ?? [];
  const selectedLabel = formatDayMonthYear(selected);

  useEffect(() => {
    const todayKey = toDateKey(new Date());
    const todays = reminderMap.get(todayKey) ?? [];
    if (!todays.length) return;
    todays
      .filter((item) => item.status === "active")
      .forEach((item) => {
        const storageKey = `norevi_reminder_toast_${item.id}`;
        if (localStorage.getItem(storageKey)) return;
        const date = parseISODate(item.remind_at);
        const timeLabel = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
        show(`${item.title} · ${timeLabel}`);
        localStorage.setItem(storageKey, "1");
      });
  }, [reminderMap, locale, show]);

  const handleAddNote = async () => {
    if (!noteTitle.trim()) return;
    setSaving(true);
    const payload = {
      title: noteTitle.trim(),
      body: noteBody.trim(),
      note_date: selectedKey,
    };
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setNoteItems((prev) => [...prev, data.data]);
        setNoteTitle("");
        setNoteBody("");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddReminder = async () => {
    if (!title.trim()) return;
    setSaving(true);
    const iso = new Date(`${selectedKey}T${time}:00`).toISOString();
    const payload = {
      title: title.trim(),
      description: "",
      remind_at: iso,
      repeat_type: "none",
      priority: "medium",
      status: "active",
    };
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [...prev, data.data]);
        setTitle("");
      }
    } finally {
      setSaving(false);
    }
  };

  const Wrapper: React.ElementType = withCard ? Card : "div";

  return (
    <Wrapper className={withCard ? "" : "space-y-4"}>
      {showHeader ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[var(--brand-700)]">Norevi Flow</p>
            <h3 className="text-xl font-bold text-[var(--text)]">{t.calendarPlanner.title}</h3>
            {showHint ? <p className="text-sm text-[var(--text-muted)]">{t.calendarPlanner.hint}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-9 px-3 text-xs"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            >
              ◀
            </Button>
            <p className="text-sm font-semibold text-[var(--text)]">{monthFormatter.format(month)}</p>
            <Button
              type="button"
              variant="secondary"
              className="h-9 px-3 text-xs"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            >
              ▶
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{monthFormatter.format(month)}</p>
            {showHint ? <p className="text-xs text-[var(--text-muted)]">{t.calendarPlanner.hint}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-9 px-3 text-xs"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            >
              ◀
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-9 px-3 text-xs"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            >
              ▶
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1.5 text-[11px] text-[var(--text-muted)] sm:gap-2 sm:text-xs">
        {weekDays.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((date) => {
          const key = toDateKey(date);
          const inMonth = date.getMonth() === month.getMonth();
          const isSelected = key === selectedKey;
          const hasReminder = reminderMap.has(key);
          const hasNote = noteMap.has(key);
          const topPriority = reminderPriorityMap.get(key);
          const dotClass =
            topPriority === "high"
              ? "bg-[var(--danger)]"
              : topPriority === "medium"
                ? "bg-[var(--warning)]"
                : "bg-[var(--brand-300)]";
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(date)}
              className={[
                "relative flex h-9 items-center justify-center rounded-[11px] border text-xs transition sm:h-10 sm:rounded-[12px] sm:text-sm",
                inMonth ? "border-[var(--border)] text-[var(--text)]" : "border-transparent text-[var(--text-muted)]",
                isSelected
                  ? "border-[var(--brand-700)] bg-[var(--brand-700)] text-white"
                  : "bg-[var(--surface-soft)]",
                isSelected ? "dark:border-[var(--brand-700)] dark:bg-[var(--brand-700)] dark:text-white" : "dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)] dark:text-[var(--text-dark)]",
              ].join(" ")}
            >
              {date.getDate()}
              {hasReminder || hasNote ? (
                <span className="absolute bottom-1 flex items-center gap-1">
                  {hasReminder ? <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} /> : null}
                  {hasNote ? <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-500)]" /> : null}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[16px] border border-[var(--divider)] bg-[var(--surface-soft)] p-3 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
          <p className="text-xs text-[var(--text-muted)]">{t.calendarPlanner.selectedDate}</p>
          <p className="text-sm font-semibold text-[var(--text)]">
            {selectedLabel}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {selectedReminders.length || selectedNotes.length ? t.calendarPlanner.dayHasTasks : t.calendarPlanner.dayNoTasks}
          </p>
          <div className="mt-3 grid gap-2">
            <label className="space-y-1">
              <span className="text-xs text-[var(--text-muted)]">{t.calendarPlanner.reminderTitle}</span>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--text-muted)]">{t.calendarPlanner.reminderTime}</span>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
            <Button type="button" onClick={handleAddReminder} disabled={saving || !title.trim()}>
              {t.calendarPlanner.addReminder}
            </Button>
            <div className="pt-2 border-t border-[var(--divider)] dark:border-[var(--border-dark)]">
              <label className="space-y-1">
                <span className="text-xs text-[var(--text-muted)]">{t.calendarPlanner.noteTitle}</span>
                <Input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
              </label>
              <label className="mt-2 space-y-1">
                <span className="text-xs text-[var(--text-muted)]">{t.calendarPlanner.noteBody}</span>
                <Textarea rows={3} value={noteBody} onChange={(e) => setNoteBody(e.target.value)} />
              </label>
              <Button type="button" className="mt-2" onClick={handleAddNote} disabled={saving || !noteTitle.trim()}>
                {t.calendarPlanner.addNote}
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-[16px] border border-[var(--divider)] bg-[var(--surface-soft)] p-3 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
          <p className="text-xs text-[var(--text-muted)]">
            {t.calendarPlanner.remindersForDate} {selectedLabel}
          </p>
          {selectedReminders.length ? (
            <ul className="mt-2 space-y-2">
              {selectedReminders.map((item) => {
                const date = parseISODate(item.remind_at);
                const priorityLabel =
                  item.priority === "high"
                    ? t.forms.priorityHigh
                    : item.priority === "low"
                      ? t.forms.priorityLow
                      : t.forms.priorityMedium;
                const priorityBadge =
                  item.priority === "high"
                    ? "bg-[var(--danger)] text-white"
                    : item.priority === "low"
                      ? "bg-[var(--brand-100)] text-[var(--brand-800)]"
                      : "bg-[var(--warning)] text-white";
                return (
                  <li
                    key={item.id}
                    className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
                  >
                    <p className="font-semibold text-[var(--text)]">{item.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)]">
                        {date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityBadge}`}>
                        {priorityLabel}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[var(--text-muted)]">{t.calendarPlanner.emptyForDate}</p>
          )}
          <div className="mt-4">
            <p className="text-xs text-[var(--text-muted)]">
              {t.calendarPlanner.notesForDate} {selectedLabel}
            </p>
            {selectedNotes.length ? (
              <ul className="mt-2 space-y-2">
                {selectedNotes.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
                  >
                    <p className="font-semibold text-[var(--text)]">{item.title}</p>
                    {item.body ? <p className="text-xs text-[var(--text-muted)]">{item.body}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[var(--text-muted)]">{t.calendarPlanner.emptyNotes}</p>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
