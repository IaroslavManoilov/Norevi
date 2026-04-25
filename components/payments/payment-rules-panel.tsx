"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Rule = {
  id: string;
  pattern: string;
  category_id: string;
};

type Category = {
  id: string;
  name: string;
};

type Labels = {
  title: string;
  hint: string;
  pattern: string;
  category: string;
  save: string;
  delete: string;
  empty: string;
  addTitle: string;
  addCta: string;
};

export function PaymentRulesPanel({ labels }: { labels: Labels }) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newPattern, setNewPattern] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/payment-rules")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setRules(data?.data ?? []))
      .catch(() => null);

    fetch("/api/categories?type=expense")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCategories(data?.data ?? []))
      .catch(() => null);
  }, []);

  const categoryOptions = useMemo(() => categories.filter((c) => c.name), [categories]);

  const handleAdd = async () => {
    if (!newPattern.trim() || !newCategory) return;
    setSaving(true);
    try {
      const res = await fetch("/api/payment-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern: newPattern.trim().toLowerCase(), category_id: newCategory }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data) setRules((prev) => [...prev, data.data]);
        setNewPattern("");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (rule: Rule, category_id: string) => {
    const res = await fetch(`/api/payment-rules/${rule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pattern: rule.pattern, category_id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data) {
        setRules((prev) => prev.map((item) => (item.id === rule.id ? data.data : item)));
      }
    }
  };

  const handleDelete = async (rule: Rule) => {
    const res = await fetch(`/api/payment-rules/${rule.id}`, { method: "DELETE" });
    if (res.ok) {
      setRules((prev) => prev.filter((item) => item.id !== rule.id));
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">{labels.title}</p>
          <p className="text-xs text-[var(--text-muted)]">{labels.hint}</p>
        </div>
      </div>

      <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.addTitle}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Input
            value={newPattern}
            onChange={(event) => setNewPattern(event.target.value)}
            placeholder={labels.pattern}
            className="h-9 w-56"
          />
          <select
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            className="h-9 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--text)] outline-none dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
          >
            <option value="">{labels.category}</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Button type="button" className="h-9 px-3 text-xs" onClick={handleAdd} disabled={saving}>
            {labels.addCta}
          </Button>
        </div>
      </div>

      {rules.length ? (
        <div className="mt-4 space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text)]">{rule.pattern}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  defaultValue={rule.category_id}
                  onChange={(event) => handleSave(rule, event.target.value)}
                  className="h-8 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)] outline-none dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Button type="button" variant="secondary" className="h-8 px-2 text-xs" onClick={() => handleDelete(rule)}>
                  {labels.delete}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--text-muted)]">{labels.empty}</p>
      )}
    </Card>
  );
}
