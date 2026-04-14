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
    <header className="mb-5 flex flex-col gap-3 border-b border-[var(--divider)] pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-full">
        <h1 className="text-2xl leading-tight font-bold tracking-tight text-[var(--text)] sm:text-4xl md:text-[44px]">
          {title}
        </h1>
        {subtitle ? <p className="mt-1 text-sm text-[var(--text-soft)] sm:text-lg">{subtitle}</p> : null}
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 pt-1 sm:w-auto sm:justify-end">
        <LanguageSwitcher language={language} />
        <Link href="/finance/new">
          <Button className="h-10 w-full gap-1 px-4 text-sm sm:h-11 sm:w-auto">
            <Plus size={14} />
            {quickLabel}
          </Button>
        </Link>
        <form action={signOut}>
          <Button variant="secondary" className="h-10 w-full px-4 text-sm sm:h-11 sm:w-auto">
            {signOutText}
          </Button>
        </form>
      </div>
    </header>
  );
}
