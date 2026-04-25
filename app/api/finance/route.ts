import { NextResponse } from "next/server";
import { transactionSchema } from "@/lib/validations/schemas";
import { createTransaction } from "@/features/finance/server/transactions-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function POST(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, transactionSchema);
  if (hasRouteError(payload)) return payload.response;

  const { data, error } = await createTransaction(auth.supabase, auth.userId, payload.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
