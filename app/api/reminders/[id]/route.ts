import { NextResponse } from "next/server";
import { reminderSchema } from "@/lib/validations/schemas";
import { deleteReminder, updateReminder } from "@/features/reminders/server/reminders-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, reminderSchema.partial());
  if (hasRouteError(payload)) return payload.response;

  const { data, error } = await updateReminder(auth.supabase, auth.userId, id, payload.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const { error } = await deleteReminder(auth.supabase, auth.userId, id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
