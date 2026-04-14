"use client";

import { useEffect } from "react";

export function DevCacheReset() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const reset = async () => {
      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }

        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
        }
      } catch {
        // Ignore cache reset errors in dev mode.
      }
    };

    void reset();
  }, []);

  return null;
}
