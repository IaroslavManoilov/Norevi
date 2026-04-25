import { redirect } from "next/navigation";
import { requireAuthOnly } from "@/lib/auth/guards";
import { OnboardingWizard } from "@/features/settings/onboarding-wizard";

export default async function OnboardingPage() {
  const { profile } = await requireAuthOnly();

  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-2xl py-8">
      <OnboardingWizard
        defaults={{
          currency: profile?.currency ?? "MDL",
          language: profile?.language ?? "en",
          monthly_budget_limit: profile?.monthly_budget_limit ?? null,
        }}
      />
    </div>
  );
}
