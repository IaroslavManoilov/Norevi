import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth";
import { getTranslations } from "@/lib/i18n/translations";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

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
    <header className="sticky top-0 z-20 -mx-3 mb-5 flex flex-col gap-3 border-b border-[var(--divider)] bg-[var(--bg)]/95 px-3 pb-4 pt-3 backdrop-blur sm:static sm:z-auto sm:mx-0 sm:bg-transparent sm:px-0 sm:pt-0 sm:backdrop-blur-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-full">
        <h1 className="text-2xl leading-tight font-bold tracking-tight text-[var(--text)] sm:text-4xl md:text-[44px]">
          {title}
        </h1>
        {subtitle ? <p className="mt-1 text-sm text-[var(--text-soft)] sm:text-lg">{subtitle}</p> : null}
      </div>
      <div className="flex w-full flex-col gap-2 pt-1 sm:w-auto sm:items-end sm:gap-3">
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:justify-end sm:overflow-visible sm:pb-0">
          <LanguageSwitcher language={language} compact />
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
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
