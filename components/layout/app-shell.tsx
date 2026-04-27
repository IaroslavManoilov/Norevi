import { DesktopSidebar } from "@/components/navigation/desktop-sidebar";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { RatesAutoSync } from "@/components/rates/rates-auto-sync";
import { PushNudges } from "@/components/pwa/push-nudges";
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
      <PushNudges />
      <div className="app-backdrop min-h-dvh bg-[var(--bg)] text-[var(--text)] md:grid md:grid-cols-[236px_minmax(0,1fr)] lg:grid-cols-[264px_minmax(0,1fr)]">
        <DesktopSidebar />
        <main className="min-w-0 px-3 pb-[calc(6.4rem+env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-[calc(6.8rem+env(safe-area-inset-bottom))] md:px-7 md:pb-8 md:pt-5 lg:px-9">
          <div className="mx-auto w-full max-w-[1160px]">{children}</div>
        </main>
        <MobileBottomNav />
      </div>
    </I18nProvider>
  );
}
