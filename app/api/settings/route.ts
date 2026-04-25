import { NextResponse } from "next/server";
import { settingsSchema } from "@/lib/validations/schemas";
import { updateSettings } from "@/features/settings/server/profile-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function PATCH(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, settingsSchema.partial());
  if (hasRouteError(payload)) return payload.response;

  const { data, error } = await updateSettings(auth.supabase, auth.userId, payload.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
