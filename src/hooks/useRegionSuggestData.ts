import { useState, useEffect } from "react";
import { isDemoModeEnabled } from "../features/accounts/demoData";
import { DEMO_REGIONS } from "../data/demoLocationData";
import type { DemoRegion } from "../data/demoLocationData";
import { apiFetch } from "../lib/api/client";
import { normalizeListResponse, type ListResponseWire } from "../lib/api/responseShape";

export type RegionOption = DemoRegion;

export function useRegionSuggestData() {
  const [items, setItems] = useState<RegionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoModeEnabled()) {
      setItems(DEMO_REGIONS);
      setLoading(false);
      return;
    }
    let cancelled = false;
    apiFetch<ListResponseWire<RegionOption>>("/locations/regions")
      .then((res) => {
        if (!cancelled) setItems(normalizeListResponse(res));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load regions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}
