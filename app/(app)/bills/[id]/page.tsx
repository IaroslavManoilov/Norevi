import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { BillForm } from "@/components/forms/bill-form";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";

export default async function BillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);

  const { data: bill } = await supabase.from("bills").select("*").eq("id", id).eq("user_id", user.id).single();
  if (!bill) notFound();

  return (
    <div>
      <TopBar
        title={t.bills.editTitle}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="max-w-xl space-y-4 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5">
        <BillForm id={id} defaultValues={bill} />
        <ConfirmDeleteButton endpoint={`/api/bills/${id}`} redirectTo="/bills" />
      </div>
    </div>
  );
}
