import { NextResponse } from "next/server";
import { billSchema } from "@/lib/validations/schemas";
import { deleteBill, updateBillAndScheduleRecurrence } from "@/features/bills/server/bills-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, billSchema.partial());
  if (hasRouteError(payload)) return payload.response;

  const { data, error } = await updateBillAndScheduleRecurrence(auth.supabase, auth.userId, id, payload.data);
  if (error) {
    const normalized = error as { message?: string; code?: string };
    const status = normalized?.code === "not_found" ? 404 : 400;
    return NextResponse.json({ error: normalized?.message ?? "request_failed" }, { status });
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const { error } = await deleteBill(auth.supabase, auth.userId, id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
