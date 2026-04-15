import Link from "next/link";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/lib/i18n/translations";
import { AuthLanguageSwitcher } from "@/components/i18n/auth-language-switcher";
import { LangLink } from "@/components/i18n/lang-link";

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const language =
    resolved?.lang === "en" || resolved?.lang === "ro" || resolved?.lang === "ru" ? resolved.lang : "en";
  const t = getTranslations(language);
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[var(--shadow-card)]">
        <BrandLockup titleClassName="text-[52px]" subtitleClassName="text-[9px]" tagline={t.tagline} />
        <h1 className="mt-3 text-4xl font-bold leading-tight text-[var(--text)]">
          {t.landing.title}
        </h1>
        <p className="mt-3 text-[var(--text-soft)]">{t.landing.subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <LangLink href="/auth/sign-up" defaultLanguage={language}>
            <Button className="h-12 px-6">{t.landing.ctaPrimary}</Button>
          </LangLink>
          <LangLink href="/auth/sign-in" defaultLanguage={language}>
            <Button variant="secondary" className="h-12 px-6">
              {t.landing.ctaSecondary}
            </Button>
          </LangLink>
          <div className="ml-2">
            <AuthLanguageSwitcher basePath="/" defaultLanguage={language} />
          </div>
        </div>
      </div>
    </main>
  );
}
