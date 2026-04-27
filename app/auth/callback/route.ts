import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const lang = searchParams.get("lang");
  const safeLang = lang === "ru" || lang === "en" || lang === "ro" ? lang : null;
  const authError = searchParams.get("error");
  const authErrorDescription = searchParams.get("error_description");

  const makeAuthErrorRedirect = (message: string) => {
    const target = new URL("/auth/sign-in", request.url);
    if (safeLang) {
      target.searchParams.set("lang", safeLang);
    }
    target.searchParams.set("oauth_error", message);
    return NextResponse.redirect(target);
  };

  if (authError || authErrorDescription) {
    return makeAuthErrorRedirect(authErrorDescription ?? authError ?? "OAuth failed");
  }

  if (!code) {
    return makeAuthErrorRedirect("Missing OAuth code");
  }

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return makeAuthErrorRedirect(error.message || "Unable to exchange external code");
    }
  } catch {
    return makeAuthErrorRedirect("Unable to exchange external code");
  }

  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const successTarget = new URL(redirectTo, request.url);
  if (safeLang && !successTarget.searchParams.get("lang")) {
    successTarget.searchParams.set("lang", safeLang);
  }
  return NextResponse.redirect(successTarget);
}
