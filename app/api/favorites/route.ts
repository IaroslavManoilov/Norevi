import { NextResponse } from "next/server";
import { favoriteItemSchema } from "@/lib/validations/schemas";
import { listFavoriteItems, upsertFavoriteItem } from "@/features/favorites/server/favorites-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function GET() {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const { data, error } = await listFavoriteItems(auth.supabase, auth.userId);
  if (error) return NextResponse.json({ data: [], error: error.message }, { status: 200 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, favoriteItemSchema);
  if (hasRouteError(payload)) return payload.response;

  const { data, error } = await upsertFavoriteItem(auth.supabase, auth.userId, payload.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
