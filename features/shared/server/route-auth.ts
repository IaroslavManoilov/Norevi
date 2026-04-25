import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import type { ServerSupabase } from "@/features/shared/server/supabase-types";

export type RouteUserContext = {
  supabase: ServerSupabase;
  userId: string;
};

type RouteErrorResult = {
  response: NextResponse;
};

export async function requireRouteUser(): Promise<RouteUserContext | RouteErrorResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return {
    supabase,
    userId: user.id,
  };
}

export function hasRouteError(result: unknown): result is RouteErrorResult {
  return Boolean(result && typeof result === "object" && "response" in result);
}

export async function parseJsonWithSchema<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<{ data: T } | RouteErrorResult> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { response: NextResponse.json({ error: "validation_error" }, { status: 400 }) };
  }

  const payload = schema.safeParse(body);
  if (!payload.success) {
    return { response: NextResponse.json({ error: "validation_error" }, { status: 400 }) };
  }

  return { data: payload.data };
}
