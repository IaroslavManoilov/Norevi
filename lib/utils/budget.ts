import { remainingDaysInMonth } from "@/lib/dates/month";

export type DailyLimitState = "positive" | "caution" | "warning" | "neutral";

export function calculateDailySafeLimit(balance: number, requiredBills: number) {
  const days = remainingDaysInMonth(new Date());
  const limit = (balance - requiredBills) / days;

  let state: DailyLimitState = "neutral";
  if (!Number.isFinite(limit)) state = "neutral";
  else if (limit > 20) state = "positive";
  else if (limit >= 0) state = "caution";
  else state = "warning";

  return {
    limit: Number.isFinite(limit) ? limit : 0,
    days,
    state,
  };
}
