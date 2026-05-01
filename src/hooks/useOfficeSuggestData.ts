import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api/client";
import { isDemoModeEnabled } from "../features/accounts/demoData";
import { getDemoOfficeSuggestItems } from "../features/offices/demoData";
import { normalizeListResponse, type ListResponseWire } from "../lib/api/responseShape";

export interface OfficeOption {
  id: string;
  office_name: string;
  office_code: string | null;
  office_type: string;
  city_municipality: string | null;
}

export function useOfficeSuggestData() {
  const [items, setItems] = useState<OfficeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (isDemoModeEnabled()) {
      setItems(getDemoOfficeSuggestItems());
      setLoading(false);
      return;
    }

    apiFetch<ListResponseWire<OfficeOption>>("/offices?limit=500")
      .then((res) => {
        if (!cancelled) setItems(normalizeListResponse(res));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load offices");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}
