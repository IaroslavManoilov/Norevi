import { TopBar } from "@/components/layout/top-bar";
import { BillForm } from "@/components/forms/bill-form";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";

export default async function NewBillPage() {
  const { profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);

  return (
    <div>
      <TopBar
        title={t.actions.addBill}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="max-w-xl rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5">
        <BillForm />
      </div>
    </div>
  );
}
