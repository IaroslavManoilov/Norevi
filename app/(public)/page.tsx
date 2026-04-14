import Link from "next/link";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/lib/i18n/translations";

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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-card)]">
        <BrandLockup titleClassName="text-[52px]" subtitleClassName="text-[9px]" tagline={t.tagline} />
        <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-[var(--text)]">
          {t.landing.title}
        </h1>
        <p className="mt-3 max-w-xl text-[var(--text-soft)]">{t.landing.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth/sign-up">
            <Button className="h-12 px-6">{t.landing.ctaPrimary}</Button>
          </Link>
          <Link href="/auth/sign-in">
            <Button variant="secondary" className="h-12 px-6">
              {t.landing.ctaSecondary}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
