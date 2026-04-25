const NS = "norevi_lifesync";

export const STORAGE_KEYS = {
  language: `${NS}_language`,
  ratesSyncAt: (base: string) => `${NS}_rates_sync_at_${base.toUpperCase()}`,
  reminderToast: (reminderId: string) => `${NS}_reminder_toast_${reminderId}`,
  paidToday: (dateKey: string) => `${NS}_paid_today_${dateKey}`,
  paidMethod: (dateKey: string) => `${NS}_paid_method_${dateKey}`,
  criticalReminder: (billId: string) => `${NS}_critical_reminder_${billId}`,
  foodSpendPlan: (monthKey: string) => `${NS}_food_spend_plan_${monthKey}`,
  foodManualItems: `${NS}_food_manual_items`,
  weeklyStaples: (weekStartIsoDate: string) => `${NS}_weekly_staples_${weekStartIsoDate}`,
} as const;

export function readStorageWithLegacy(key: string, legacyKey?: string): string | null {
  const current = window.localStorage.getItem(key);
  if (current !== null) return current;

  if (!legacyKey) return null;

  const legacyValue = window.localStorage.getItem(legacyKey);
  if (legacyValue === null) return null;

  window.localStorage.setItem(key, legacyValue);
  return legacyValue;
}
