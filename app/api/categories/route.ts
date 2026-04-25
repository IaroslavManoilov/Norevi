import { NextResponse } from "next/server";
import { listCategories } from "@/features/categories/server/categories-service";
import { hasRouteError, requireRouteUser } from "@/features/shared/server/route-auth";

export async function GET(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const typeParam = new URL(request.url).searchParams.get("type");
  const type = typeParam === "income" || typeParam === "expense" ? typeParam : undefined;

  const { data, error } = await listCategories(auth.supabase, auth.userId, type);
  if (error) return NextResponse.json({ data: [], error: error.message }, { status: 200 });
  return NextResponse.json({ data });
}
