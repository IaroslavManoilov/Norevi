"use client";

import { useState } from "react";
import { createClient } from "@/lib/db/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n/i18n-provider";

type OAuthProvider = "google" | "apple";
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

export function SignInForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signInWithOAuth = async (provider: OAuthProvider, providerLabel: string) => {
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
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
                emailRedirectTo: `${window.location.origin}/auth/callback`,
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
        <Button
          variant="secondary"
          className="h-11 w-full rounded-[12px]"
          type="button"
          onClick={() => signInWithOAuth("google", "Google")}
        >
          {t.auth.signInWithGoogle}
        </Button>
        <Button
          variant="secondary"
          className="h-11 w-full rounded-[12px]"
          type="button"
          onClick={() => signInWithOAuth("apple", "Apple")}
        >
          {t.auth.signInWithApple}
        </Button>
      </div>
    </div>
  );
}

export function SignUpForm() {
  const { t } = useI18n();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signInWithOAuth = async (provider: OAuthProvider, providerLabel: string) => {
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
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
                emailRedirectTo: `${window.location.origin}/auth/callback`,
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
        <Button
          variant="secondary"
          className="h-11 w-full rounded-[12px]"
          type="button"
          onClick={() => signInWithOAuth("google", "Google")}
        >
          {t.auth.signInWithGoogle}
        </Button>
        <Button
          variant="secondary"
          className="h-11 w-full rounded-[12px]"
          type="button"
          onClick={() => signInWithOAuth("apple", "Apple")}
        >
          {t.auth.signInWithApple}
        </Button>
      </div>
    </div>
  );
}
