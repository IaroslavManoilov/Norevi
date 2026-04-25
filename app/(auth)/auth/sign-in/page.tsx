import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
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
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(79,176,176,0.2),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(23,106,113,0.25),transparent_36%),linear-gradient(165deg,#041c21,#09282f_55%,#0b353c)] px-4 py-8 sm:px-6 sm:py-10">
        <div className="pointer-events-none absolute top-[-130px] right-[-120px] h-[340px] w-[340px] rounded-full bg-[var(--brand-300)]/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-150px] left-[-120px] h-[360px] w-[360px] rounded-full bg-[var(--brand-500)]/20 blur-3xl" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden rounded-[26px] border border-white/15 bg-white/8 p-8 text-[#d4ece8] shadow-[0_22px_70px_rgba(3,17,21,0.45)] backdrop-blur-xl lg:block">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/8 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#b9dbd5]">
              <ShieldCheck size={14} />
              Secure Access
            </span>
            <h2 className="mt-5 text-[clamp(2rem,3.4vw,3rem)] leading-[1.06] font-bold text-[#ecf7f4]">
              {t.auth.signInTitle}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#b9d6d1]">
              {t.landing.subtitle}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[14px] border border-white/14 bg-white/7 p-3">
                <p className="text-xs font-semibold text-[#dff1ed]">{t.dashboard.quickPayTitle}</p>
                <p className="mt-1 text-xs text-[#a9c9c2]">{t.dashboard.quickPayHint}</p>
              </div>
              <div className="rounded-[14px] border border-white/14 bg-white/7 p-3">
                <p className="text-xs font-semibold text-[#dff1ed]">{t.dashboard.dailyLimit}</p>
                <p className="mt-1 text-xs text-[#a9c9c2]">{t.dashboard.dailyHintPositive}</p>
              </div>
            </div>
          </section>

          <Card className="w-full rounded-[24px] border border-white/20 bg-white/95 p-5 shadow-[0_22px_60px_rgba(4,14,16,0.34)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <BrandLockup compact titleClassName="text-[30px] sm:text-[34px]" subtitleClassName="text-[9px]" tagline={t.tagline} />
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] bg-[var(--brand-100)] text-[var(--brand-800)]">
                <Sparkles size={16} />
              </span>
            </div>
            <div className="mt-4">
              <AuthLanguageSwitcher basePath="/auth/sign-in" defaultLanguage={language} setup={setup} />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-[var(--text)]">{t.auth.signInTitle}</h1>
            <p className="mb-5 text-sm text-[var(--text-soft)]">{t.auth.signInTitle} · {t.appName}</p>
            {params.setup === "supabase" ? (
              <p className="mb-4 rounded-[12px] border border-[var(--warning)]/35 bg-[var(--warning)]/10 p-3 text-sm text-[var(--text)]">
                {t.auth.envMissing}
              </p>
            ) : null}
            <SignInForm />
            <p className="mt-4 text-sm text-[var(--text-soft)]">
              {t.auth.signUpTitle}?{" "}
              <Link href="/auth/sign-up" className="font-semibold text-[var(--brand-700)] hover:text-[var(--brand-800)]">
                {t.auth.signUpCta}
              </Link>
            </p>
          </Card>
        </div>
      </main>
    </I18nProvider>
  );
}
