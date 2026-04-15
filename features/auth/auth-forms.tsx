"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/db/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n/i18n-provider";

export function SignInForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setError(t.auth.envMissing);
          return;
        }
        try {
          const supabase = createClient();
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) {
            setError(signInError.message);
            return;
          }
          router.push("/dashboard");
          router.refresh();
        } catch {
          setError(t.auth.networkError);
        }
      }}
    >
      <Input type="email" placeholder={t.auth.email} value={email} onChange={(e) => setEmail(e.target.value)} required />
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={t.auth.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pr-10"
        />
        <button
          type="button"
          aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-[var(--text-muted)] transition hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-200)]"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <Button type="submit" className="w-full">
        {t.auth.signInCta}
      </Button>
    </form>
  );
}

export function SignUpForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setError(t.auth.envMissing);
          return;
        }
        try {
          const supabase = createClient();
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });
          if (signUpError) {
            setError(signUpError.message);
            return;
          }
          router.push("/onboarding");
          router.refresh();
        } catch {
          setError(t.auth.networkError);
        }
      }}
    >
      <Input placeholder={t.auth.name} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <Input type="email" placeholder={t.auth.email} value={email} onChange={(e) => setEmail(e.target.value)} required />
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={t.auth.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pr-10"
        />
        <button
          type="button"
          aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-[var(--text-muted)] transition hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-200)]"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <Button type="submit" className="w-full">
        {t.auth.signUpCta}
      </Button>
    </form>
  );
}
