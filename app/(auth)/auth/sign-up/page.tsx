import Link from "next/link";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { Card } from "@/components/ui/card";
import { SignUpForm } from "@/features/auth/auth-forms";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { getTranslations } from "@/lib/i18n/translations";
import { AuthLanguageSwitcher } from "@/components/i18n/auth-language-switcher";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const language =
    resolved?.lang === "en" || resolved?.lang === "ro" || resolved?.lang === "ru" ? resolved.lang : "en";
  const t = getTranslations(language);
  return (
    <I18nProvider language={language}>
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
        <Card className="w-full">
          <BrandLockup compact titleClassName="text-[40px]" subtitleClassName="text-[9px]" tagline={t.tagline} />
          <div className="mt-4">
            <AuthLanguageSwitcher basePath="/auth/sign-up" defaultLanguage={language} />
          </div>
          <h1 className="mt-4 text-2xl font-bold">{t.auth.signUpTitle}</h1>
          <p className="mb-5 text-sm text-[var(--text-soft)]">{t.auth.signUpCta}</p>
          <SignUpForm />
          <p className="mt-4 text-sm text-[var(--text-soft)]">
            {t.auth.signInTitle}? <Link href="/auth/sign-in" className="text-[var(--brand-700)]">{t.auth.signInCta}</Link>
          </p>
        </Card>
      </main>
    </I18nProvider>
  );
}
