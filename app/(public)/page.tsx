import { ArrowRight, BellRing, Brain, CalendarClock, ShieldCheck, Wallet } from "lucide-react";
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

  const copy =
    language === "ru"
      ? {
          bestOffer: "Лучшее предложение",
          bestOfferText: "Один веб-продукт, который заменяет 5 приложений: финансы, календарь, платежи, напоминания и AI.",
          whyTitle: "Почему Norevi лучше",
          whyItems: [
            "Умный ритм дня: система сама расставляет приоритеты.",
            "Платежи и напоминания в одном потоке, без хаоса.",
            "Push-уведомления и AI-помощник для фокуса и дисциплины.",
          ],
          flowTitle: "Как это работает",
          flowItems: [
            "Добавь доходы, расходы и обязательные платежи.",
            "Получи личный daily-план и безопасный лимит.",
            "Выполняй задачи из одной ленты с push-подсказками.",
          ],
          ctaHint: "Запуск за 2 минуты. Никаких сложных настроек.",
        }
      : language === "ro"
        ? {
            bestOffer: "Cea mai buna oferta",
            bestOfferText: "Un singur web-app care inlocuieste 5 produse: finante, calendar, plati, memento si AI.",
            whyTitle: "De ce Norevi este mai bun",
            whyItems: [
              "Ritm zilnic inteligent: sistemul prioritizeaza automat.",
              "Plati si memento intr-un singur flux, fara haos.",
              "Push notifications si asistent AI pentru focus si disciplina.",
            ],
            flowTitle: "Cum functioneaza",
            flowItems: [
              "Adaugi venituri, cheltuieli si plati obligatorii.",
              "Primesti plan zilnic personal si limita sigura.",
              "Executi task-urile dintr-un singur flux cu push smart.",
            ],
            ctaHint: "Pornire in 2 minute. Fara configurari grele.",
          }
        : {
            bestOffer: "Best Offer",
            bestOfferText: "One web product replacing 5 apps: finance, calendar, bills, reminders, and AI.",
            whyTitle: "Why Norevi Wins",
            whyItems: [
              "Smart daily rhythm with automatic prioritization.",
              "Bills and reminders in one flow, no chaos.",
              "Push nudges + AI assistant for focus and consistency.",
            ],
            flowTitle: "How It Works",
            flowItems: [
              "Add income, expenses, and required bills.",
              "Get a personal daily plan and safe spending limit.",
              "Execute tasks from one feed with smart push nudges.",
            ],
            ctaHint: "Start in 2 minutes. No complex setup.",
          };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_14%_16%,rgba(79,176,176,0.24),transparent_36%),radial-gradient(circle_at_86%_18%,rgba(23,106,113,0.3),transparent_38%),linear-gradient(160deg,#061b20,#0a2f36_57%,#0d3f48)] px-4 py-8 text-[#e7f5f2] sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="glass-panel flex items-center justify-between gap-3 rounded-[18px] border-white/15 px-4 py-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[#bfe8e0] uppercase">
            <ShieldCheck size={14} />
            {copy.bestOffer}
          </div>
          <AuthLanguageSwitcher basePath="/" defaultLanguage={language} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="glass-panel rounded-[26px] border-white/15 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-8">
            <BrandLockup
              compact
              className="text-white"
              titleClassName="text-[42px] text-white"
              subtitleClassName="text-[9px] text-[#afd7cf]"
              tagline={t.tagline}
            />
            <h1 className="mt-6 text-[clamp(2rem,4.5vw,4rem)] leading-[1.02] font-bold text-[#eef9f6]">
              {t.landing.title}
            </h1>
            <p className="mt-3 text-[1.03rem] leading-relaxed text-[#bddbd5]">{t.landing.subtitle}</p>
            <p className="mt-3 text-sm font-semibold text-[#9fd7cc]">{copy.bestOfferText}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/16 bg-white/8 px-3 py-1.5 text-xs font-semibold text-[#d8efea]">
                <Wallet size={13} />
                Finance OS
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/16 bg-white/8 px-3 py-1.5 text-xs font-semibold text-[#d8efea]">
                <CalendarClock size={13} />
                Smart Calendar
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/16 bg-white/8 px-3 py-1.5 text-xs font-semibold text-[#d8efea]">
                <BellRing size={13} />
                Push Nudge AI
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/16 bg-white/8 px-3 py-1.5 text-xs font-semibold text-[#d8efea]">
                <Brain size={13} />
                Rhythm Coach
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
              <LangLink href="/auth/sign-up" defaultLanguage={language}>
                <Button className="h-12 min-w-[180px] gap-2 rounded-[14px] bg-[var(--brand-300)] px-6 text-[var(--brand-900)] hover:bg-[var(--brand-200)]">
                  {t.landing.ctaPrimary}
                  <ArrowRight size={15} />
                </Button>
              </LangLink>
              <LangLink href="/auth/sign-in" defaultLanguage={language}>
                <Button variant="secondary" className="h-12 min-w-[140px] rounded-[14px] border border-white/20 bg-white/10 px-6 text-white hover:bg-white/18">
                  {t.landing.ctaSecondary}
                </Button>
              </LangLink>
            </div>
            <p className="mt-3 text-xs text-[#a9d0ca]">{copy.ctaHint}</p>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="glass-panel rounded-[24px] border-white/15 p-5">
              <h2 className="text-lg font-bold text-[#ebf9f6]">{copy.whyTitle}</h2>
              <ul className="mt-3 space-y-2.5">
                {copy.whyItems.map((item) => (
                  <li key={item} className="rounded-[12px] border border-white/14 bg-white/8 px-3 py-2 text-sm text-[#c6e3de]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel rounded-[24px] border-white/15 p-5">
              <h2 className="text-lg font-bold text-[#ebf9f6]">{copy.flowTitle}</h2>
              <ol className="mt-3 space-y-2.5">
                {copy.flowItems.map((item, index) => (
                  <li key={item} className="flex items-start gap-2 rounded-[12px] border border-white/14 bg-white/8 px-3 py-2 text-sm text-[#c6e3de]">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-300)] text-[11px] font-bold text-[var(--brand-900)]">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
