import { NextResponse } from "next/server";
import { reminderSchema } from "@/lib/validations/schemas";
import { createReminderWithNotification } from "@/features/reminders/server/reminders-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function POST(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, reminderSchema);
  if (hasRouteError(payload)) return payload.response;

  const { data, error } = await createReminderWithNotification(auth.supabase, auth.userId, payload.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ data });
}
