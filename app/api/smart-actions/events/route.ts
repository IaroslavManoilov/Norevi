import { NextResponse } from "next/server";
import { z } from "zod";
import { logSmartActionEvent } from "@/features/smart-actions/server/smart-actions-events-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

const smartActionEventSchema = z.object({
  action_id: z.string().min(2).max(64),
  event_type: z.enum(["view", "click", "complete", "dismiss"]),
  variant: z.enum(["A", "B"]),
  position: z.number().int().min(1).max(10).optional().nullable(),
  score: z.number().int().min(0).max(200).optional().nullable(),
  meta: z.record(z.string(), z.unknown()).optional().nullable(),
});

export async function POST(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, smartActionEventSchema);
  if (hasRouteError(payload)) return payload.response;

  const { error } = await logSmartActionEvent(auth.supabase, auth.userId, payload.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
