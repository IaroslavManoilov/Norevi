import { AppShell } from "@/components/layout/app-shell";
import { requireAuthOnly } from "@/lib/auth/guards";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAuthOnly();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const currency = profile?.currency ?? "MDL";
  return (
    <AppShell language={language} currency={currency}>
      {children}
    </AppShell>
  );
}
