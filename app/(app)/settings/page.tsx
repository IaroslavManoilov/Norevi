import { TopBar } from "@/components/layout/top-bar";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/forms/profile-form";
import { SettingsForm } from "@/components/forms/settings-form";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";

export default async function SettingsPage() {
  const { profile, supabase, user } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  const { data: categories } = await supabase.from("categories").select("name, type").eq("user_id", user.id).order("name");
  const expenseCategories = (categories ?? []).filter((c) => c.type === "expense");
  const incomeCategories = (categories ?? []).filter((c) => c.type === "income");

  return (
    <div>
      <TopBar
        title={t.settings.title}
        subtitle={`${t.settings.currency}, ${t.settings.language}, ${t.settings.timezone}`}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <Card className="min-h-[120px]">
          <p className="text-sm text-[var(--text-soft)]">{t.settings.currency}</p>
          <p className="mt-2 text-2xl font-semibold">{profile?.currency ?? "MDL"}</p>
        </Card>
        <Card className="min-h-[120px]">
          <p className="text-sm text-[var(--text-soft)]">{t.settings.language}</p>
          <p className="mt-2 text-2xl font-semibold">
            {language === "ru" ? t.languages.ru : language === "ro" ? t.languages.ro : t.languages.en}
          </p>
        </Card>
        <Card className="min-h-[120px]">
          <p className="text-sm text-[var(--text-soft)]">{t.settings.timezone}</p>
          <p className="mt-2 text-xl font-semibold">{profile?.timezone ?? "Europe/Chisinau"}</p>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-[var(--shadow-card)]">
          <h2 className="mb-1 text-xl font-semibold">{t.settings.name}</h2>
          <p className="mb-4 text-sm text-[var(--text-soft)]">{t.settings.name}</p>
          <ProfileForm fullName={profile?.full_name} />
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <h2 className="mb-1 text-xl font-semibold">{t.settings.title}</h2>
          <p className="mb-4 text-sm text-[var(--text-soft)]">{t.settings.budgetLimit}</p>
          <SettingsForm defaultValues={profile ?? {}} />
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">{t.dashboard.topCategories}</h2>
          {expenseCategories.length ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {expenseCategories.map((c) => (
                <li key={`${c.type}-${c.name}`} className="rounded-[12px] bg-[var(--surface-soft)] px-3 py-2 text-sm">
                  {c.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[14px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-muted)]">
              {t.settings.noExpenseCategories}
            </div>
          )}
        </Card>
        <Card>
          <h2 className="mb-3 text-lg font-semibold">{t.dashboard.incomeMonth}</h2>
          {incomeCategories.length ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {incomeCategories.map((c) => (
                <li key={`${c.type}-${c.name}`} className="rounded-[12px] bg-[var(--surface-soft)] px-3 py-2 text-sm">
                  {c.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[14px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-muted)]">
              {t.settings.noIncomeCategories}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
