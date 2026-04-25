import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { TransactionForm } from "@/components/forms/transaction-form";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { requireOnboarded } from "@/lib/auth/guards";
import { getCategories } from "@/lib/db/queries";
import { getTranslations } from "@/lib/i18n/translations";

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);

  const [{ data: transaction }, categories] = await Promise.all([
    supabase.from("transactions").select("*").eq("id", id).eq("user_id", user.id).single(),
    getCategories(supabase, user.id),
  ]);

  if (!transaction) notFound();

  return (
    <div>
      <TopBar
        title={t.finance.editTitle}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="max-w-xl space-y-4 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5">
        <TransactionForm id={id} categories={categories} defaultValues={transaction} />
        <ConfirmDeleteButton endpoint={`/api/finance/${id}`} redirectTo="/finance" />
      </div>
    </div>
  );
}
