import Link from "next/link";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/features/auth/auth-forms";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { getTranslations } from "@/lib/i18n/translations";
import { AuthLanguageSwitcher } from "@/components/i18n/auth-language-switcher";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const language = params.lang === "en" || params.lang === "ro" || params.lang === "ru" ? params.lang : "en";
  const t = getTranslations(language);
  const setup = params.setup ?? null;

  return (
    <I18nProvider language={language}>
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
        <Card className="w-full">
          <BrandLockup compact titleClassName="text-[40px]" subtitleClassName="text-[9px]" tagline={t.tagline} />
          <div className="mt-4">
            <AuthLanguageSwitcher basePath="/auth/sign-in" defaultLanguage={language} setup={setup} />
          </div>
          <h1 className="mt-4 text-2xl font-bold">{t.auth.signInTitle}</h1>
          <p className="mb-5 text-sm text-[var(--text-soft)]">{t.auth.signInTitle} · {t.appName}</p>
          {params.setup === "supabase" ? (
            <p className="mb-4 rounded-[12px] bg-[var(--surface-soft)] p-3 text-sm text-[var(--text-soft)]">
              {t.auth.envMissing}
            </p>
          ) : null}
          <SignInForm />
          <p className="mt-4 text-sm text-[var(--text-soft)]">
            {t.auth.signUpTitle}? <Link href="/auth/sign-up" className="text-[var(--brand-700)]">{t.auth.signUpCta}</Link>
          </p>
        </Card>
      </main>
    </I18nProvider>
  );
}
