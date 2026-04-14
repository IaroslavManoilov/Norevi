import { DesktopSidebar } from "@/components/navigation/desktop-sidebar";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { RatesAutoSync } from "@/components/rates/rates-auto-sync";
import type { Language } from "@/lib/i18n/translations";

export function AppShell({
  children,
  language = "en",
  currency = "MDL",
}: {
  children: React.ReactNode;
  language?: Language;
  currency?: string;
}) {
  return (
    <I18nProvider language={language}>
      <RatesAutoSync baseCurrency={currency} />
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] md:grid md:grid-cols-[264px_minmax(0,1fr)]">
        <DesktopSidebar />
        <main className="min-w-0 px-3 pb-28 pt-3 sm:px-6 sm:pb-24 md:px-8 md:pb-8 md:pt-7 lg:px-10">
          <div className="mx-auto w-full max-w-[1120px]">{children}</div>
        </main>
        <MobileBottomNav />
      </div>
    </I18nProvider>
  );
}
