import { TopBar } from "@/components/layout/top-bar";
import { TransactionForm } from "@/components/forms/transaction-form";
import { requireOnboarded } from "@/lib/auth/guards";
import { getCategories } from "@/lib/db/queries";
import { getTranslations } from "@/lib/i18n/translations";

export default async function NewTransactionPage({ searchParams }: { searchParams: Promise<{ type?: "income" | "expense" }> }) {
  const { supabase, user, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  const params = await searchParams;
  const categories = await getCategories(supabase, user.id);

  return (
    <div>
      <TopBar
        title={params.type === "income" ? t.actions.addIncome : t.actions.addExpense}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="max-w-xl rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5">
        <TransactionForm categories={categories} defaultValues={{ type: params.type ?? "expense" }} />
      </div>
    </div>
  );
}
