import Image from "next/image";
import { ArrowRight, CalendarCheck2, CreditCard, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
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

  const highlights = [
    {
      id: "safe-limit",
      icon: <Sparkles size={18} />,
      title: t.dashboard.dailyLimit,
      desc: t.dashboard.dailyHintPositive,
    },
    {
      id: "payments",
      icon: <CreditCard size={18} />,
      title: t.dashboard.quickPayTitle,
      desc: t.dashboard.quickPayHint,
    },
    {
      id: "calendar",
      icon: <CalendarCheck2 size={18} />,
      title: t.calendarPlanner.title,
      desc: t.calendarPlanner.hint,
    },
    {
      id: "control",
      icon: <TrendingUp size={18} />,
      title: t.dashboard.flowAnalytics,
      desc: t.dashboard.flowAnalyticsDesc,
    },
  ];

  const trust = [
    t.dashboard.flowScore,
    t.dashboard.avgPerDay,
    t.dashboard.upcomingBills,
    t.dashboard.reminders,
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(79,176,176,0.24),transparent_32%),radial-gradient(circle_at_82%_22%,rgba(23,106,113,0.3),transparent_37%),linear-gradient(160deg,#03161a,#07242a_52%,#0a333a)] text-[#eaf6f3]">
      <div className="pointer-events-none absolute top-[-140px] right-[-120px] h-[360px] w-[360px] rounded-full bg-[var(--brand-300)]/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] left-[-140px] h-[420px] w-[420px] rounded-full bg-[var(--brand-500)]/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pt-12">
        <header className="landing-fade-up flex items-center justify-between gap-4 rounded-[20px] border border-white/15 bg-white/6 px-4 py-3 backdrop-blur-xl sm:px-5">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.08em] text-[#c6e7e1] uppercase">
            <ShieldCheck size={15} />
            LifeSync Mode
          </div>
          <AuthLanguageSwitcher basePath="/" defaultLanguage={language} />
        </header>

        <section className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="landing-fade-up rounded-[28px] border border-white/15 bg-white/8 p-6 shadow-[0_28px_80px_rgba(4,16,19,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
            <BrandLockup
              compact
              className="text-white"
              titleClassName="text-[30px] sm:text-[38px] lg:text-[42px] text-white"
              subtitleClassName="text-[9px] sm:text-[10px] text-[#a9d3cc]"
              tagline={t.tagline}
            />

            <h1 className="mt-6 max-w-3xl text-[clamp(2.15rem,4.5vw,4.2rem)] leading-[1.02] font-bold text-[#edf8f5]">
              {t.landing.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[clamp(1rem,1.45vw,1.2rem)] leading-relaxed text-[#c4ded9]">
              {t.landing.subtitle}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LangLink
                href="/auth/sign-up"
                defaultLanguage={language}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[var(--brand-300)] px-5 text-sm font-semibold text-[#062a31] transition hover:bg-[var(--brand-200)]"
              >
                {t.landing.ctaPrimary}
                <ArrowRight size={16} />
              </LangLink>
              <LangLink
                href="/auth/sign-in"
                defaultLanguage={language}
                className="inline-flex h-12 items-center justify-center rounded-[14px] border border-white/25 bg-white/10 px-5 text-sm font-semibold text-[#e8f6f3] transition hover:bg-white/18"
              >
                {t.landing.ctaSecondary}
              </LangLink>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {trust.map((item) => (
                <div
                  key={item}
                  className="rounded-[12px] border border-white/12 bg-white/8 px-3 py-2 text-center text-[11px] font-semibold tracking-[0.04em] text-[#b8d8d2]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="landing-fade-up rounded-[28px] border border-white/15 bg-white/8 p-4 shadow-[0_28px_80px_rgba(4,16,19,0.45)] backdrop-blur-xl sm:p-5 lg:p-6">
            <div className="relative overflow-hidden rounded-[22px] border border-white/15 bg-[linear-gradient(165deg,rgba(255,255,255,0.16),rgba(255,255,255,0.05))] p-4 sm:p-5">
              <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-[var(--brand-300)]/25 blur-2xl" />
              <Image
                src="/brand/logo-light.png"
                alt="Norevi LifeSync"
                width={640}
                height={390}
                className="relative mx-auto w-full max-w-[620px] rounded-[18px] border border-white/20 bg-white/95 p-4 shadow-[0_22px_48px_rgba(3,18,22,0.34)]"
                priority
              />

              <div className="relative mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[14px] border border-white/14 bg-white/9 p-3">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[#9ec7c0]">{t.dashboard.flowScore}</p>
                  <p className="mt-1 text-2xl font-bold text-[#e8f6f3]">92</p>
                </div>
                <div className="rounded-[14px] border border-white/14 bg-white/9 p-3">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[#9ec7c0]">{t.dashboard.avgPerDay}</p>
                  <p className="mt-1 text-2xl font-bold text-[#e8f6f3]">$41</p>
                </div>
                <div className="rounded-[14px] border border-white/14 bg-white/9 p-3">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[#9ec7c0]">{t.dashboard.quickPayTitle}</p>
                  <p className="mt-1 text-2xl font-bold text-[#e8f6f3]">1 Tap</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-fade-up mt-6 rounded-[24px] border border-white/12 bg-white/6 p-4 backdrop-blur-xl sm:mt-8 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <article
                key={item.id}
                className="group rounded-[16px] border border-white/12 bg-white/7 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] bg-[var(--brand-300)]/22 text-[#9ce0d5]">
                  {item.icon}
                </span>
                <h3 className="mt-2.5 text-sm font-semibold text-[#e3f2ef]">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#b4d2cc]">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
