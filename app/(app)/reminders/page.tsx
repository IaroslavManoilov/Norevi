import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { RemindersList } from "@/components/shared/reminders-list";
import { Card } from "@/components/ui/card";
import { requireOnboarded } from "@/lib/auth/guards";
import { getReminders } from "@/lib/db/queries";
import { getTranslations } from "@/lib/i18n/translations";

export default async function RemindersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: "active" | "done" | "cancelled"; priority?: "low" | "medium" | "high" }>;
}) {
  const { supabase, user, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  const params = await searchParams;
  const reminders = await getReminders(supabase, user.id);

  const selectedStatus = params.status ?? "all";
  const selectedPriority = params.priority ?? "all";

  const filtered = reminders.filter((reminder) => {
    if (selectedStatus !== "all" && reminder.status !== selectedStatus) return false;
    if (selectedPriority !== "all" && reminder.priority !== selectedPriority) return false;
    return true;
  });

  const activeCount = reminders.filter((r) => r.status === "active").length;
  const highPriorityCount = reminders.filter((r) => r.priority === "high" && r.status === "active").length;

  const statusChips = [
    { href: "/reminders", label: t.reminders.all, active: selectedStatus === "all" },
    { href: "/reminders?status=active", label: t.reminders.active, active: selectedStatus === "active" },
    { href: "/reminders?status=done", label: t.reminders.done, active: selectedStatus === "done" },
    { href: "/reminders?status=cancelled", label: t.reminders.cancelled, active: selectedStatus === "cancelled" },
  ];

  const base = selectedStatus === "all" ? "/reminders" : `/reminders?status=${selectedStatus}`;
  const priorityChips = [
    { href: base, label: t.reminders.priorityAny, active: selectedPriority === "all" },
    {
      href: `${base}${base.includes("?") ? "&" : "?"}priority=high`,
      label: t.reminders.priorityHigh,
      active: selectedPriority === "high",
    },
    {
      href: `${base}${base.includes("?") ? "&" : "?"}priority=medium`,
      label: t.reminders.priorityMedium,
      active: selectedPriority === "medium",
    },
    {
      href: `${base}${base.includes("?") ? "&" : "?"}priority=low`,
      label: t.reminders.priorityLow,
      active: selectedPriority === "low",
    },
  ];

  return (
    <div>
      <TopBar
        title={t.reminders.title}
        subtitle={t.reminders.subtitle}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="mb-5">
        <Link href="/reminders/new">
          <Button>{t.reminders.addReminder}</Button>
        </Link>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <Card className="min-h-[128px]">
          <p className="text-sm text-[var(--text-soft)]">{t.reminders.totalReminders}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight [font-variant-numeric:tabular-nums]">{reminders.length}</p>
        </Card>
        <Card className="min-h-[128px]">
          <p className="text-sm text-[var(--text-soft)]">{t.reminders.activeNow}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight [font-variant-numeric:tabular-nums]">{activeCount}</p>
        </Card>
        <Card className="min-h-[128px]">
          <p className="text-sm text-[var(--text-soft)]">{t.reminders.highPriority}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight [font-variant-numeric:tabular-nums]">{highPriorityCount}</p>
        </Card>
      </div>

      <div className="md:hidden">
        <div className="sticky top-0 z-20 -mx-3 mb-3 border-b border-[var(--divider)] bg-[var(--bg)]/95 px-3 py-3 backdrop-blur">
          <div className="flex gap-2 overflow-x-auto pb-1 text-sm">
            {statusChips.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className={`rounded-full border px-3 py-1.5 whitespace-nowrap transition ${
                  chip.active
                    ? "border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-900)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)]"
                }`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 text-sm">
            {priorityChips.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className={`rounded-full border px-3 py-1.5 whitespace-nowrap transition ${
                  chip.active
                    ? "border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-900)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)]"
                }`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="mb-3 flex flex-wrap gap-2 text-sm">
          {statusChips.map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className={`rounded-full border px-3 py-1.5 transition ${
                chip.active
                  ? "border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-900)]"
                  : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] hover:border-[var(--brand-200)] hover:text-[var(--text)]"
              }`}
            >
              {chip.label}
            </Link>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          {priorityChips.map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className={`rounded-full border px-3 py-1.5 transition ${
                chip.active
                  ? "border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-900)]"
                  : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] hover:border-[var(--brand-200)] hover:text-[var(--text)]"
              }`}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>

      <RemindersList reminders={filtered} language={language} />
    </div>
  );
}
