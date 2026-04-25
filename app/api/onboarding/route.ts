import { NextResponse } from "next/server";
import { onboardingSchema } from "@/lib/validations/schemas";
import { completeOnboarding } from "@/features/settings/server/profile-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function POST(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, onboardingSchema);
  if (hasRouteError(payload)) return payload.response;

  const { error } = await completeOnboarding(auth.supabase, auth.userId, payload.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
