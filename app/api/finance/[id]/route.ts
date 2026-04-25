import { NextResponse } from "next/server";
import { transactionSchema } from "@/lib/validations/schemas";
import { deleteTransaction, updateTransaction } from "@/features/finance/server/transactions-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, transactionSchema.partial());
  if (hasRouteError(payload)) return payload.response;

  const { data, error } = await updateTransaction(auth.supabase, auth.userId, id, payload.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const { error } = await deleteTransaction(auth.supabase, auth.userId, id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
