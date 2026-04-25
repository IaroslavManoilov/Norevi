import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { ReminderForm } from "@/components/forms/reminder-form";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";

export default async function ReminderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);

  const { data: reminder } = await supabase.from("reminders").select("*").eq("id", id).eq("user_id", user.id).single();
  if (!reminder) notFound();

  const defaults = {
    ...reminder,
    remind_at: new Date(reminder.remind_at).toISOString().slice(0, 16),
  };

  return (
    <div>
      <TopBar
        title={t.reminders.editTitle}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="max-w-xl space-y-4 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5">
        <ReminderForm id={id} defaultValues={defaults} />
        <ConfirmDeleteButton endpoint={`/api/reminders/${id}`} redirectTo="/reminders" />
      </div>
    </div>
  );
}
