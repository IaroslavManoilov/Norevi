"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastItem = { id: number; message: string };

const ToastContext = createContext<{ show: (message: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] shadow-[var(--shadow-soft)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)] dark:text-[var(--text-dark)]"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { show: (_message: string) => undefined };
  }
  return ctx;
}
