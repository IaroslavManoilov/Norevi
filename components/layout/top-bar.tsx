import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth";
import { getTranslations } from "@/lib/i18n/translations";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { MobileTopMenu } from "@/components/layout/mobile-top-menu";

export function TopBar({
  title,
  subtitle,
  quickActionLabel,
  signOutLabel,
  language = "en",
}: {
  title: string;
  subtitle?: string;
  quickActionLabel?: string;
  signOutLabel?: string;
  language?: "ru" | "en" | "ro";
}) {
  const t = getTranslations(language);
  const quickLabel = quickActionLabel ?? t.actions.quickAction;
  const signOutText = signOutLabel ?? t.actions.signOut;
  return (
    <header className="glass-panel sticky top-0 z-20 -mx-3 mb-5 flex flex-col gap-3 rounded-b-[20px] border-b border-[var(--divider)] px-3 pb-4 pt-3 backdrop-blur sm:static sm:z-auto sm:mx-0 sm:rounded-[18px] sm:border sm:bg-transparent sm:px-4 sm:py-3 sm:backdrop-blur-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="max-w-full">
          <h1 className="text-2xl leading-tight font-bold tracking-tight text-[var(--text)] sm:text-4xl md:text-[42px]">
            {title}
          </h1>
          {subtitle ? <p className="mt-1 text-sm text-[var(--text-soft)] sm:max-w-[70ch] sm:text-base">{subtitle}</p> : null}
        </div>
        <div className="sm:hidden">
          <MobileTopMenu language={language} quickActionLabel={quickLabel} signOutLabel={signOutText} />
        </div>
      </div>
      <div className="hidden w-full flex-col gap-2 pt-1 sm:flex sm:w-auto sm:max-w-full sm:items-end sm:gap-3">
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:justify-end sm:overflow-visible sm:pb-0">
          <LanguageSwitcher language={language} compact />
        </div>
        <div className="flex w-full gap-2 sm:w-auto sm:flex-wrap sm:justify-end">
          <Link href="/finance/new" className="flex-1 sm:flex-none">
            <Button className="h-10 w-full gap-1 px-4 text-sm sm:h-11 sm:w-auto">
              <Plus size={14} />
              {quickLabel}
            </Button>
          </Link>
          <form action={signOut} className="flex-1 sm:flex-none">
            <Button variant="secondary" className="h-10 w-full px-4 text-sm sm:h-11 sm:w-auto">
              {signOutText}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
