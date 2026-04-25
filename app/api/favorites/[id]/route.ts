import { NextResponse } from "next/server";
import { deleteFavoriteItem } from "@/features/favorites/server/favorites-service";
import { hasRouteError, requireRouteUser } from "@/features/shared/server/route-auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const { error } = await deleteFavoriteItem(auth.supabase, auth.userId, id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
