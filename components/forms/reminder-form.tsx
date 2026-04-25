"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { reminderSchema } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/components/i18n/i18n-provider";

type ReminderValues = z.input<typeof reminderSchema>;

export function ReminderForm({
  defaultValues,
  id,
}: {
  defaultValues?: Partial<ReminderValues>;
  id?: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { t } = useI18n();
  const form = useForm<ReminderValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: "",
      description: "",
      remind_at: new Date().toISOString().slice(0, 16),
      repeat_type: "none",
      priority: "medium",
      status: "active",
      ...defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const payload = {
      ...values,
      remind_at: values.remind_at.includes("T") ? new Date(values.remind_at).toISOString() : values.remind_at,
    };

    const res = await fetch(id ? `/api/reminders/${id}` : "/api/reminders", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: null }));
      if (data.error === "validation_error") {
        setServerError(t.errors.validation.generic);
      } else {
        setServerError(t.errors.saveReminder);
      }
      return;
    }
    router.push("/reminders");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input placeholder={t.forms.reminderTitle} {...form.register("title")} />
      <Input type="datetime-local" {...form.register("remind_at")} />
      <Select {...form.register("repeat_type")}>
        <option value="none">{t.forms.repeatNone}</option>
        <option value="daily">{t.forms.repeatDaily}</option>
        <option value="weekly">{t.forms.repeatWeekly}</option>
        <option value="monthly">{t.forms.repeatMonthly}</option>
      </Select>
      <Select {...form.register("priority")}>
        <option value="low">{t.forms.priorityLow}</option>
        <option value="medium">{t.forms.priorityMedium}</option>
        <option value="high">{t.forms.priorityHigh}</option>
      </Select>
      <Select {...form.register("status")}>
        <option value="active">{t.forms.statusActive}</option>
        <option value="done">{t.forms.statusDone}</option>
        <option value="cancelled">{t.forms.statusCancelled}</option>
      </Select>
      <Textarea rows={3} placeholder={t.forms.reminderDesc} {...form.register("description")} />
      {serverError ? <p className="text-sm text-[var(--danger)]">{serverError}</p> : null}
      <Button type="submit" className="w-full sm:w-auto">
        {id ? t.forms.save : t.forms.add}
      </Button>
    </form>
  );
}
