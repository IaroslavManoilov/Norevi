import Link from "next/link";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { Card } from "@/components/ui/card";
import { SignUpForm } from "@/features/auth/auth-forms";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { getTranslations } from "@/lib/i18n/translations";
import { AuthLanguageSwitcher } from "@/components/i18n/auth-language-switcher";
import { Sparkles, ShieldCheck } from "lucide-react";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string; oauth_error?: string }>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const language =
    resolved?.lang === "en" || resolved?.lang === "ro" || resolved?.lang === "ru" ? resolved.lang : "en";
  const t = getTranslations(language);
  const oauthError = resolved?.oauth_error ? decodeURIComponent(resolved.oauth_error) : null;
  const oauthCallbackHint = oauthError?.toLowerCase().includes("unable to exchange external code")
    ? language === "ru"
      ? "Проверьте Google OAuth: callback URL из Supabase должен быть добавлен в Authorized redirect URIs в Google Cloud."
      : language === "ro"
        ? "Verifica Google OAuth: callback URL din Supabase trebuie adaugat in Authorized redirect URIs in Google Cloud."
        : "Check Google OAuth: Supabase callback URL must be added to Authorized redirect URIs in Google Cloud."
    : null;
  return (
    <I18nProvider language={language}>
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(79,176,176,0.2),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(23,106,113,0.28),transparent_38%),linear-gradient(160deg,#06191d,#0a2b31_58%,#0e3840)] px-4 py-8 text-[#e6f5f2] sm:px-6 sm:py-10">
        <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <section className="glass-panel order-2 rounded-[26px] border-white/15 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.38)] sm:p-7 lg:order-1 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[#bee8df] uppercase">
              <ShieldCheck size={14} />
              LifeSync Onboarding
            </div>
            <div className="mt-5">
              <BrandLockup
                compact
                className="text-white"
                titleClassName="text-[38px] text-white"
                subtitleClassName="text-[9px] text-[#b7d8d2]"
                tagline={t.tagline}
              />
            </div>
            <h1 className="mt-7 text-[clamp(1.9rem,4vw,3.3rem)] leading-[1.03] font-bold text-[#eef9f6]">
              {t.auth.signUpTitle}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#bcd8d2]">
              {t.landing.title}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2 min-[430px]:grid-cols-3">
              <div className="rounded-[14px] border border-white/15 bg-white/8 px-3 py-2 text-center">
                <p className="text-[10px] tracking-[0.08em] text-[#9fc7c0] uppercase">{t.dashboard.flowScore}</p>
                <p className="mt-1 text-xl font-bold text-white">92</p>
              </div>
              <div className="rounded-[14px] border border-white/15 bg-white/8 px-3 py-2 text-center">
                <p className="text-[10px] tracking-[0.08em] text-[#9fc7c0] uppercase">{t.dashboard.avgPerDay}</p>
                <p className="mt-1 text-xl font-bold text-white">$41</p>
              </div>
              <div className="rounded-[14px] border border-white/15 bg-white/8 px-3 py-2 text-center">
                <p className="text-[10px] tracking-[0.08em] text-[#9fc7c0] uppercase">{t.dashboard.activeReminders}</p>
                <p className="mt-1 text-xl font-bold text-white">0</p>
              </div>
            </div>
          </section>

          <Card className="glass-panel order-1 w-full rounded-[26px] border-white/15 bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-5 shadow-[0_28px_84px_rgba(0,0,0,0.38)] sm:p-7 lg:order-2">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-200)] bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand-800)]">
                <Sparkles size={13} />
                {t.appName}
              </div>
              <AuthLanguageSwitcher basePath="/auth/sign-up" defaultLanguage={language} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-[var(--text)] sm:text-3xl">{t.auth.signUpTitle}</h2>
            <p className="mb-5 mt-2 text-sm text-[var(--text-soft)]">{t.auth.signUpCta}</p>
            {oauthError ? (
              <p className="mb-4 rounded-[12px] border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3 text-sm text-[var(--danger)]">
                {t.auth.oauthFailed}: {oauthError}
              </p>
            ) : null}
            {oauthCallbackHint ? (
              <p className="mb-4 rounded-[12px] border border-[var(--warning)]/35 bg-[var(--warning)]/10 p-3 text-xs leading-relaxed text-[var(--text-soft)]">
                {oauthCallbackHint}
              </p>
            ) : null}
            <SignUpForm />
            <p className="mt-5 text-sm text-[var(--text-soft)]">
              {t.auth.signInTitle}?{" "}
              <Link href="/auth/sign-in" className="font-semibold text-[var(--brand-700)] hover:text-[var(--brand-800)]">
                {t.auth.signInCta}
              </Link>
            </p>
          </Card>
        </div>
      </main>
    </I18nProvider>
  );
}
