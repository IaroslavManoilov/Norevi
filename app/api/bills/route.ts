import { NextResponse } from "next/server";
import { billSchema } from "@/lib/validations/schemas";
import { createBill } from "@/features/bills/server/bills-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function POST(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, billSchema);
  if (hasRouteError(payload)) return payload.response;

  const { data, error } = await createBill(auth.supabase, auth.userId, payload.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
