import { NextResponse } from "next/server";
import { categoryResolveSchema } from "@/lib/validations/schemas";
import { resolveOrCreateCategory } from "@/features/categories/server/categories-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function POST(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, categoryResolveSchema);
  if (hasRouteError(payload)) return payload.response;

  const { data, error } = await resolveOrCreateCategory(auth.supabase, auth.userId, payload.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
