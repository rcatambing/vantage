import { useState, useEffect } from "react";
import { isDemoModeEnabled } from "../features/accounts/demoData";
import { DEMO_STAFF } from "../data/demoLocationData";
import type { DemoStaffMember } from "../data/demoLocationData";
import { apiFetch } from "../lib/api/client";

export type StaffOption = DemoStaffMember;

export function useUserSuggestData() {
  const [items, setItems] = useState<StaffOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoModeEnabled()) {
      setItems(DEMO_STAFF);
      setLoading(false);
      return;
    }
    let cancelled = false;
    apiFetch<{ data: StaffOption[] }>("/users/staff?page_size=500")
      .then((res) => {
        if (!cancelled) setItems(res.data ?? []);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load staff");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}
