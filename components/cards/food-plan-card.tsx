"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/formatters";
import { useToast } from "@/components/ui/toast";

type FoodPlanLabels = {
  title: string;
  subtitle: string;
  budgetToday: string;
  avgDaily: string;
  budgetMonth: string;
  remainingMonth: string;
  planTitle: string;
  planBudget: string;
  planLow: string;
  planMid: string;
  planHigh: string;
  categoriesTitle: string;
  categoriesHome: string;
  categoriesCafe: string;
  categoriesDelivery: string;
  stableTitle: string;
  stableHint: string;
  stableEmpty: string;
  favoriteTitle: string;
  favoriteHint: string;
  favoritePlaceholder: string;
  favoriteAdd: string;
  favoriteRemove: string;
  weeklyReminderTitle: string;
  weeklyReminderDescription: string;
  weeklyReminderToast: string;
  manualTitle: string;
  manualHint: string;
  manualAdd: string;
  manualItem: string;
  manualPrice: string;
  manualTotal: string;
  spendPlanTitle: string;
  spendPlanHint: string;
  spendPlanDaily: string;
  spendPlanMonthly: string;
  spendPlanList: string;
  spendPlanRemaining: string;
  spendPlanDays: string;
  spendPlanReset: string;
  goalTitle: string;
  goalHint: string;
  goalInput: string;
  goalSpent: string;
  goalRemaining: string;
  goalProgress: string;
  ideas: string;
  ideaLow: string;
  ideaMid: string;
  ideaHigh: string;
  reminderTitle: string;
  reminderCta: string;
  reminderToast: string;
  personalTitle: string;
};

export function FoodPlanCard({
  foodBudgetToday,
  avgFoodDaily,
  foodBudgetMonth,
  foodRemainingMonth,
  foodSpentMonth,
  categories,
  stableItems,
  currency,
  language,
  personalItems,
  favoriteItems,
  labels,
  showHeader = true,
}: {
  foodBudgetToday: number;
  avgFoodDaily: number;
  foodBudgetMonth: number;
  foodRemainingMonth: number;
  foodSpentMonth: number;
  categories: { home: number; cafe: number; delivery: number };
  stableItems?: string[];
  currency: string;
  language: "ru" | "en" | "ro";
  personalItems?: string[];
  favoriteItems?: { id: string; title: string }[];
  labels: FoodPlanLabels;
  showHeader?: boolean;
}) {
  const parseNumberInput = (value: string) => {
    const normalized = value.replace(",", ".").trim();
    if (!normalized) return 0;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };
  const [saving, setSaving] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [favorites, setFavorites] = useState(favoriteItems ?? []);
  const [favoriteInput, setFavoriteInput] = useState("");
  const { show } = useToast();
  const [manualName, setManualName] = useState("");
  const [manualPrice, setManualPrice] = useState<number>(0);
  const [manualItems, setManualItems] = useState<{ id: string; name: string; price: number }[]>([]);
  const [plannedDaily, setPlannedDaily] = useState<number>(0);
  const [plannedMonthly, setPlannedMonthly] = useState<number>(0);
  const [foodGoal, setFoodGoal] = useState<number>(0);
  const monthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);
  const spendPlanStorageKey = `norevi_food_spend_plan_${monthKey}`;

  const suggestion =
    foodBudgetToday < 60 ? labels.ideaLow : foodBudgetToday < 120 ? labels.ideaMid : labels.ideaHigh;
  const budgetPlan =
    foodBudgetToday < 60 ? labels.planLow : foodBudgetToday < 120 ? labels.planMid : labels.planHigh;

  const [planLoaded, setPlanLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    fetch(`/api/food-plans?month=${monthKey}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.data) {
          setPlannedDaily(Number(data.data.planned_daily || 0));
          setPlannedMonthly(Number(data.data.planned_monthly || 0));
          setFoodGoal(Number(data.data.food_goal || 0));
        }
      })
      .finally(() => {
        if (active) setPlanLoaded(true);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [monthKey]);

  useEffect(() => {
    if (!planLoaded) return;
    const safePlannedDaily = Number.isFinite(plannedDaily) && plannedDaily >= 0 ? plannedDaily : 0;
    const safePlannedMonthly = Number.isFinite(plannedMonthly) && plannedMonthly >= 0 ? plannedMonthly : 0;
    const safeFoodGoal = Number.isFinite(foodGoal) && foodGoal >= 0 ? foodGoal : 0;
    const handle = setTimeout(() => {
      fetch("/api/food-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: monthKey,
          planned_daily: safePlannedDaily,
          planned_monthly: safePlannedMonthly,
          food_goal: safeFoodGoal,
        }),
      }).catch(() => null);
    }, 600);
    return () => clearTimeout(handle);
  }, [planLoaded, monthKey, plannedDaily, plannedMonthly, foodGoal]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("norevi_food_manual_items");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { id: string; name: string; price: number }[];
        setManualItems(Array.isArray(parsed) ? parsed : []);
      } catch {
        setManualItems([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("norevi_food_manual_items", JSON.stringify(manualItems));
  }, [manualItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(spendPlanStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { daily?: number; monthly?: number; foodGoal?: number };
        setPlannedDaily(Number(parsed.daily || 0));
        setPlannedMonthly(Number(parsed.monthly || 0));
        setFoodGoal(Number(parsed.foodGoal || 0));
      } catch {
        setPlannedDaily(0);
        setPlannedMonthly(0);
        setFoodGoal(0);
      }
    }
  }, [spendPlanStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      spendPlanStorageKey,
      JSON.stringify({ daily: plannedDaily, monthly: plannedMonthly, foodGoal })
    );
  }, [plannedDaily, plannedMonthly, foodGoal, spendPlanStorageKey]);

  const manualTotal = useMemo(() => manualItems.reduce((acc, item) => acc + Number(item.price || 0), 0), [manualItems]);
  const hasRealFoodData = avgFoodDaily > 0 || foodBudgetMonth > 0 || foodRemainingMonth > 0;
  const displayToday = hasRealFoodData ? foodBudgetToday : 0;
  const displayAvg = hasRealFoodData ? avgFoodDaily || 0 : 0;
  const displayMonth = hasRealFoodData ? foodBudgetMonth || 0 : 0;
  const displayRemaining = hasRealFoodData ? foodRemainingMonth || 0 : 0;
  const remainingAfterList = displayRemaining - manualTotal;
  const hasUserPlan = plannedDaily > 0 || plannedMonthly > 0 || manualTotal > 0;
  const remainingAfterPlan = hasUserPlan
    ? plannedMonthly > 0
      ? remainingAfterList - plannedMonthly
      : remainingAfterList
    : 0;
  const daysCoverage = hasUserPlan && plannedDaily > 0 ? remainingAfterList / plannedDaily : 0;
  const goalRemaining = foodGoal > 0 ? foodGoal - foodSpentMonth : 0;
  const goalProgress = foodGoal > 0 ? Math.min(100, (foodSpentMonth / foodGoal) * 100) : 0;

  useEffect(() => {
    if (!stableItems || !stableItems.length) return;
    if (typeof window === "undefined") return;
    const now = new Date();
    const day = now.getDay();
    const mondayOffset = (day + 6) % 7;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - mondayOffset);
    weekStart.setHours(0, 0, 0, 0);
    const key = `norevi_weekly_staples_${weekStart.toISOString().slice(0, 10)}`;
    if (localStorage.getItem(key)) return;

    const nextMonday = new Date(weekStart);
    nextMonday.setDate(weekStart.getDate() + 7);
    nextMonday.setHours(9, 0, 0, 0);
    const description = `${labels.weeklyReminderDescription}\n${stableItems.map((item) => `• ${item}`).join("\n")}`;

    fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: labels.weeklyReminderTitle,
        description,
        remind_at: nextMonday.toISOString(),
        repeat_type: "weekly",
        priority: "low",
        status: "active",
      }),
    })
      .then((res) => {
        if (res.ok) {
          localStorage.setItem(key, "1");
          show(labels.weeklyReminderToast);
        }
      })
      .catch(() => null);
  }, [stableItems, labels, show]);

  useEffect(() => {
    setFavorites(favoriteItems ?? []);
  }, [favoriteItems]);


  const handleAddManual = () => {
    const name = manualName.trim();
    const price = Number(manualPrice || 0);
    if (!name || price <= 0) return;
    setManualItems((prev) => [...prev, { id: `${Date.now()}-${name}`, name, price }]);
    setManualName("");
    setManualPrice(0);
  };

  const handleRemoveManual = (id: string) => {
    setManualItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetPlan = () => {
    setPlannedDaily(0);
    setPlannedMonthly(0);
    setFoodGoal(0);
    if (typeof window !== "undefined") {
      localStorage.removeItem(spendPlanStorageKey);
    }
  };

  const handleAddFavorite = async () => {
    const value = favoriteInput.trim();
    if (!value) return;
    setSavingFavorite(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value, kind: "food" }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites((prev) => {
          if (prev.some((item) => item.id === data.data.id)) return prev;
          return [...prev, { id: data.data.id, title: data.data.title }];
        });
        setFavoriteInput("");
      }
    } finally {
      setSavingFavorite(false);
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    setSavingFavorite(true);
    try {
      const res = await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
      }
    } finally {
      setSavingFavorite(false);
    }
  };

  const handleReminder = async () => {
    setSaving(true);
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(9, 0, 0, 0);
    const payload = {
      title: labels.reminderTitle,
      description: "",
      remind_at: date.toISOString(),
      repeat_type: "none",
      priority: "low",
      status: "active",
    };
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        show(labels.reminderToast);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="min-h-[220px]">
      {showHeader ? (
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{labels.title}</p>
            <p className="text-xs text-[var(--text-muted)]">{labels.subtitle}</p>
          </div>
          <Button type="button" variant="secondary" className="h-9 px-3 text-xs" onClick={handleReminder} disabled={saving}>
            {labels.reminderCta}
          </Button>
        </div>
      ) : (
        <div className="mb-2 flex justify-end">
          <Button type="button" variant="secondary" className="h-9 px-3 text-xs" onClick={handleReminder} disabled={saving}>
            {labels.reminderCta}
          </Button>
        </div>
      )}

      {/* Summary cards removed per user request */}

      <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {labels.manualTitle}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{labels.manualHint}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <input
              value={manualName}
              onChange={(event) => setManualName(event.target.value)}
              placeholder={labels.manualItem}
              className="h-9 w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--text)] outline-none focus:border-[var(--brand-500)] sm:w-40 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
            />
            <input
              type="number"
              min={0}
              value={Number.isFinite(manualPrice) ? manualPrice : 0}
              onChange={(event) => setManualPrice(parseNumberInput(event.target.value))}
              placeholder={labels.manualPrice}
              className="h-9 w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--text)] outline-none focus:border-[var(--brand-500)] sm:w-24 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
            />
            <Button type="button" variant="secondary" className="h-9 w-full px-3 text-xs sm:w-auto" onClick={handleAddManual}>
              {labels.manualAdd}
            </Button>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {manualItems.length ? (
            manualItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{formatMoney(item.price, currency, language)}</span>
                  <button type="button" onClick={() => handleRemoveManual(item.id)} className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)]">
                    ✕
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[var(--text-muted)]">{labels.manualHint}</p>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>{labels.manualTotal}</span>
          <span className="text-sm font-semibold text-[var(--text)]">{formatMoney(manualTotal, currency, language)}</span>
        </div>
      </div>

        <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {labels.spendPlanTitle}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{labels.spendPlanHint}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="number"
              min={0}
              value={Number.isFinite(plannedDaily) ? plannedDaily : 0}
              onChange={(event) => setPlannedDaily(parseNumberInput(event.target.value))}
              placeholder={labels.spendPlanDaily}
              className="h-9 w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--text)] outline-none focus:border-[var(--brand-500)] sm:w-28 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
            />
            <input
              type="number"
              min={0}
              value={Number.isFinite(plannedMonthly) ? plannedMonthly : 0}
              onChange={(event) => setPlannedMonthly(parseNumberInput(event.target.value))}
              placeholder={labels.spendPlanMonthly}
              className="h-9 w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--text)] outline-none focus:border-[var(--brand-500)] sm:w-32 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
            />
            <Button type="button" variant="secondary" className="h-9 w-full px-3 text-xs sm:w-auto" onClick={handleResetPlan}>
              {labels.spendPlanReset}
            </Button>
          </div>
        </div>
        <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <div className="flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]">
            <span className="text-xs text-[var(--text-muted)]">{labels.spendPlanList}</span>
            <span className="text-sm font-semibold text-[var(--text)]">
              {formatMoney(manualTotal, currency, language)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]">
            <span className="text-xs text-[var(--text-muted)]">{labels.spendPlanRemaining}</span>
            <span className={`text-sm font-semibold ${remainingAfterPlan < 0 ? "text-[var(--danger)]" : "text-[var(--text)]"}`}>
              {formatMoney(remainingAfterPlan, currency, language)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]">
            <span className="text-xs text-[var(--text-muted)]">{labels.spendPlanDays}</span>
            <span className="text-sm font-semibold text-[var(--text)]">
              {daysCoverage > 0 ? daysCoverage.toFixed(1) : "0"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {labels.goalTitle}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{labels.goalHint}</p>
          </div>
          <input
            type="number"
            min={0}
            value={Number.isFinite(foodGoal) ? foodGoal : 0}
            onChange={(event) => setFoodGoal(parseNumberInput(event.target.value))}
            placeholder={labels.goalInput}
            className="h-9 w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--text)] outline-none focus:border-[var(--brand-500)] sm:w-32 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
          />
        </div>
        <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <div className="flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]">
            <span className="text-xs text-[var(--text-muted)]">{labels.goalSpent}</span>
            <span className="text-sm font-semibold text-[var(--text)]">
              {formatMoney(foodSpentMonth, currency, language)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]">
            <span className="text-xs text-[var(--text-muted)]">{labels.goalRemaining}</span>
            <span className={`text-sm font-semibold ${goalRemaining < 0 ? "text-[var(--danger)]" : "text-[var(--text)]"}`}>
              {formatMoney(goalRemaining, currency, language)}
            </span>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-[var(--surface)] dark:bg-[var(--surface-dark)]">
          <div
            className="h-2 rounded-full bg-[var(--brand-600)]"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--text-muted)]">{labels.goalProgress.replace("{percent}", goalProgress.toFixed(0))}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.planTitle}</p>
          <p className="mt-2 text-sm text-[var(--text)]">{budgetPlan}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            {labels.planBudget} {formatMoney(foodBudgetToday, currency, language)}
          </p>
        </div>
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {labels.categoriesTitle}
          </p>
          <div className="mt-2 space-y-2 text-sm text-[var(--text)]">
            <div className="flex items-center justify-between">
              <span>{labels.categoriesHome}</span>
              <span className="font-semibold">{formatMoney(categories.home, currency, language)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{labels.categoriesCafe}</span>
              <span className="font-semibold">{formatMoney(categories.cafe, currency, language)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{labels.categoriesDelivery}</span>
              <span className="font-semibold">{formatMoney(categories.delivery, currency, language)}</span>
            </div>
          </div>
        </div>
      </div>

      {personalItems && personalItems.length ? (
        <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {labels.personalTitle}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {personalItems.slice(0, 6).map((item) => (
              <span
                key={item}
                className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-soft)] dark:bg-[var(--surface-dark)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.stableTitle}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{labels.stableHint}</p>
        {stableItems && stableItems.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {stableItems.slice(0, 6).map((item) => (
              <span
                key={item}
                className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-soft)] dark:bg-[var(--surface-dark)]"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-[var(--text-muted)]">{labels.stableEmpty}</p>
        )}
      </div>

      <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.favoriteTitle}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{labels.favoriteHint}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {favorites.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => handleRemoveFavorite(item.id)}
              className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-soft)] transition hover:bg-[var(--brand-100)] dark:bg-[var(--surface-dark)]"
            >
              {item.title} · {labels.favoriteRemove}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            value={favoriteInput}
            onChange={(event) => setFavoriteInput(event.target.value)}
            placeholder={labels.favoritePlaceholder}
            className="h-10 flex-1 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--brand-500)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
          />
          <Button type="button" variant="secondary" className="h-10 px-3 text-xs" onClick={handleAddFavorite} disabled={savingFavorite}>
            {labels.favoriteAdd}
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.ideas}</p>
        <p className="mt-2">{suggestion}</p>
      </div>
    </Card>
  );
}
