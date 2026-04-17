"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n/i18n-provider";

export function SignInForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        {info ? <p className="text-sm text-[var(--text-soft)]">{info}</p> : null}
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <Button type="submit" className="w-full">
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
          className="w-full"
          type="button"
          onClick={async () => {
            setError(null);
            try {
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}/auth/callback` },
              });
            } catch {
              setError(t.auth.networkError);
            }
          }}
        >
          {t.auth.signInWithGoogle}
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          type="button"
          onClick={async () => {
            setError(null);
            try {
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({
                provider: "apple",
                options: { redirectTo: `${window.location.origin}/auth/callback` },
              });
            } catch {
              setError(t.auth.networkError);
            }
          }}
        >
          {t.auth.signInWithApple}
        </Button>
      </div>
    </div>
  );
}

export function SignUpForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        {info ? <p className="text-sm text-[var(--text-soft)]">{info}</p> : null}
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <Button type="submit" className="w-full">
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
          className="w-full"
          type="button"
          onClick={async () => {
            setError(null);
            try {
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}/auth/callback` },
              });
            } catch {
              setError(t.auth.networkError);
            }
          }}
        >
          {t.auth.signInWithGoogle}
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          type="button"
          onClick={async () => {
            setError(null);
            try {
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({
                provider: "apple",
                options: { redirectTo: `${window.location.origin}/auth/callback` },
              });
            } catch {
              setError(t.auth.networkError);
            }
          }}
        >
          {t.auth.signInWithApple}
        </Button>
      </div>
    </div>
  );
}
