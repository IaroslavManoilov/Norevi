import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/db/supabase-middleware";
import { hasSupabaseEnv } from "@/lib/utils/env";

const PRIVATE_PREFIXES = [
  "/dashboard",
  "/finance",
  "/bills",
  "/reminders",
  "/assistant",
  "/settings",
  "/onboarding",
];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  if (!hasSupabaseEnv()) {
    return response;
  }
  const supabase = createMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPrivate = PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isPrivate && !user) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if ((pathname.startsWith("/auth/sign-in") || pathname.startsWith("/auth/sign-up")) && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
