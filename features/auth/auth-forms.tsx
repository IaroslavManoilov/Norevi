"use client";

import { useState } from "react";
import { createClient } from "@/lib/db/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n/i18n-provider";

type OAuthProvider = "google";
type AuthLikeError = { message?: string; code?: string; error_code?: string };

function normalizeAuthError(error: unknown): AuthLikeError | null {
  if (!error || typeof error !== "object") return null;
  const value = error as Record<string, unknown>;
  return {
    message: typeof value.message === "string" ? value.message : undefined,
    code: typeof value.code === "string" ? value.code : undefined,
    error_code: typeof value.error_code === "string" ? value.error_code : undefined,
  };
}

function resolveOAuthErrorMessage({
  error,
  providerLabel,
  providerNotEnabledText,
  fallback,
}: {
  error: AuthLikeError | null;
  providerLabel: string;
  providerNotEnabledText: string;
  fallback: string;
}) {
  const code = (error?.code ?? error?.error_code ?? "").toLowerCase();
  const message = (error?.message ?? "").toLowerCase();
  const isProviderNotEnabled =
    (code === "validation_failed" && message.includes("provider") && message.includes("not enabled")) ||
    message.includes("unsupported provider") ||
    message.includes("provider is not enabled");

  if (isProviderNotEnabled) return `${providerNotEnabledText}: ${providerLabel}.`;
  return error?.message ?? fallback;
}

function resolveAuthRedirectUrl() {
  const nextUrl = new URL(`${window.location.origin}/auth/callback`);
  const currentLang = new URLSearchParams(window.location.search).get("lang");
  if (currentLang === "ru" || currentLang === "en" || currentLang === "ro") {
    nextUrl.searchParams.set("lang", currentLang);
  }
  return nextUrl.toString();
}

export function SignInForm() {
  const { t, language } = useI18n();
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);
  const googleEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED !== "false";
  const oauthHint =
    language === "ru"
      ? "Если кнопка не работает, включите провайдера в Supabase: Authentication -> Sign In / Providers."
      : language === "ro"
        ? "Daca butonul nu functioneaza, activeaza providerul in Supabase: Authentication -> Sign In / Providers."
        : "If a button fails, enable that provider in Supabase: Authentication -> Sign In / Providers.";

  const signInWithOAuth = async (provider: OAuthProvider, providerLabel: string) => {
    setError(null);
    setPendingProvider(provider);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: resolveAuthRedirectUrl() },
      });
      if (oauthError) {
        setError(
          resolveOAuthErrorMessage({
            error: oauthError,
            providerLabel,
            providerNotEnabledText: t.auth.providerNotEnabled,
            fallback: t.auth.networkError,
          })
        );
      }
    } catch (unknownError) {
      setError(
        resolveOAuthErrorMessage({
          error: normalizeAuthError(unknownError),
          providerLabel,
          providerNotEnabledText: t.auth.providerNotEnabled,
          fallback: t.auth.networkError,
        })
      );
    } finally {
      setPendingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setInfo(null);
          if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            setError(t.auth.envMissing);
            return;
          }
          try {
            const supabase = createClient();
            const { error: sendError } = await supabase.auth.signInWithOtp({
              email,
              options: {
                emailRedirectTo: resolveAuthRedirectUrl(),
              },
            });
            if (sendError) {
              setError(sendError.message);
              return;
            }
            setInfo(t.auth.magicLinkSent);
          } catch {
            setError(t.auth.networkError);
          }
        }}
      >
        <Input type="email" placeholder={t.auth.email} value={email} onChange={(e) => setEmail(e.target.value)} required />
        {info ? (
          <p className="rounded-[12px] border border-[var(--brand-200)] bg-[var(--brand-50)] px-3 py-2 text-sm text-[var(--brand-900)]">
            {info}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-[12px] border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="h-12 w-full rounded-[14px]">
          {t.auth.sendLink}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <span className="h-px flex-1 bg-[var(--divider)]" />
        {t.auth.or}
        <span className="h-px flex-1 bg-[var(--divider)]" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {googleEnabled ? (
          <Button
            variant="secondary"
            className="h-11 w-full rounded-[12px]"
            type="button"
            onClick={() => signInWithOAuth("google", "Google")}
            disabled={pendingProvider !== null}
          >
            {pendingProvider === "google" ? "..." : t.auth.signInWithGoogle}
          </Button>
        ) : null}
      </div>
      <p className="text-xs leading-relaxed text-[var(--text-muted)]">{oauthHint}</p>
    </div>
  );
}

export function SignUpForm() {
  const { t, language } = useI18n();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);
  const googleEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED !== "false";
  const oauthHint =
    language === "ru"
      ? "Если OAuth не запускается, проверьте provider и callback URL в Supabase."
      : language === "ro"
        ? "Daca OAuth nu porneste, verifica providerul si callback URL in Supabase."
        : "If OAuth does not start, verify provider settings and callback URL in Supabase.";

  const signInWithOAuth = async (provider: OAuthProvider, providerLabel: string) => {
    setError(null);
    setPendingProvider(provider);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: resolveAuthRedirectUrl() },
      });
      if (oauthError) {
        setError(
          resolveOAuthErrorMessage({
            error: oauthError,
            providerLabel,
            providerNotEnabledText: t.auth.providerNotEnabled,
            fallback: t.auth.networkError,
          })
        );
      }
    } catch (unknownError) {
      setError(
        resolveOAuthErrorMessage({
          error: normalizeAuthError(unknownError),
          providerLabel,
          providerNotEnabledText: t.auth.providerNotEnabled,
          fallback: t.auth.networkError,
        })
      );
    } finally {
      setPendingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <Input placeholder={t.auth.name} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setInfo(null);
          if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            setError(t.auth.envMissing);
            return;
          }
          try {
            const supabase = createClient();
            const { error: sendError } = await supabase.auth.signInWithOtp({
              email,
              options: {
                emailRedirectTo: resolveAuthRedirectUrl(),
                data: { full_name: fullName },
              },
            });
            if (sendError) {
              setError(sendError.message);
              return;
            }
            setInfo(t.auth.magicLinkSent);
          } catch {
            setError(t.auth.networkError);
          }
        }}
      >
        <Input type="email" placeholder={t.auth.email} value={email} onChange={(e) => setEmail(e.target.value)} required />
        {info ? (
          <p className="rounded-[12px] border border-[var(--brand-200)] bg-[var(--brand-50)] px-3 py-2 text-sm text-[var(--brand-900)]">
            {info}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-[12px] border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="h-12 w-full rounded-[14px]">
          {t.auth.sendLink}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <span className="h-px flex-1 bg-[var(--divider)]" />
        {t.auth.or}
        <span className="h-px flex-1 bg-[var(--divider)]" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {googleEnabled ? (
          <Button
            variant="secondary"
            className="h-11 w-full rounded-[12px]"
            type="button"
            onClick={() => signInWithOAuth("google", "Google")}
            disabled={pendingProvider !== null}
          >
            {pendingProvider === "google" ? "..." : t.auth.signInWithGoogle}
          </Button>
        ) : null}
      </div>
      <p className="text-xs leading-relaxed text-[var(--text-muted)]">{oauthHint}</p>
    </div>
  );
}
