import { NextResponse } from "next/server";
import { fetchRates, resolveBaseCurrency } from "@/lib/rates/fetch-rates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = resolveBaseCurrency(searchParams.get("base") ?? undefined);
  const payload = await fetchRates(base);
  return NextResponse.json(payload);
}
