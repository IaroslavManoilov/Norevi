import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/layout/top-bar";
import { ReminderCalendar } from "@/components/shared/reminder-calendar";
import { requireOnboarded } from "@/lib/auth/guards";
import { getBills, getNotes, getReminders, recalculateBillStatuses } from "@/lib/db/queries";
import { getTranslations } from "@/lib/i18n/translations";

export default async function BillsCalendarPage() {
  const { supabase, user, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  await recalculateBillStatuses(supabase, user.id);
  const [bills, reminders, notes] = await Promise.all([
    getBills(supabase, user.id),
    getReminders(supabase, user.id),
    getNotes(supabase, user.id),
  ]);

  return (
    <div>
      <TopBar
        title={t.bills.calendarTitle}
        subtitle={t.bills.calendarSubtitle}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="mb-4">
        <Link href="/bills/new">
          <Button>{t.actions.addBill}</Button>
        </Link>
      </div>
      <div className="space-y-4">
        <ReminderCalendar reminders={reminders} notes={notes} language={language} />
      </div>
    </div>
  );
}
