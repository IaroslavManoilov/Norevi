import { AppShell } from "@/components/layout/app-shell";
import type { Language } from "@/lib/i18n/translations";

export function ProtectedLayout({
  children,
  language = "en",
  currency = "MDL",
}: {
  children: React.ReactNode;
  language?: Language;
  currency?: string;
}) {
  return (
    <AppShell language={language} currency={currency}>
      {children}
    </AppShell>
  );
}
