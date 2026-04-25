import { TopBar } from "@/components/layout/top-bar";
import { ReminderForm } from "@/components/forms/reminder-form";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";

export default async function NewReminderPage() {
  const { profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);

  return (
    <div>
      <TopBar
        title={t.actions.addReminder}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="max-w-xl rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5">
        <ReminderForm />
      </div>
    </div>
  );
}
