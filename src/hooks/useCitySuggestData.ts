import { useState, useEffect } from "react";
import { isDemoModeEnabled } from "../features/accounts/demoData";
import { DEMO_CITIES } from "../data/demoLocationData";
import type { DemoCity } from "../data/demoLocationData";
import { apiFetch } from "../lib/api/client";
import { normalizeListResponse, type ListResponseWire } from "../lib/api/responseShape";

export type CityOption = DemoCity;

export function useCitySuggestData(regionId: string | null) {
  const [items, setItems] = useState<DemoCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regionId) {
      setItems([]);
      setError(null);
      return;
    }

    if (isDemoModeEnabled()) {
      setItems(DEMO_CITIES.filter((c) => c.region_id === regionId));
      setLoading(false);
      return;
    }

    let cancelled = false;
    setItems([]);
    setLoading(true);
    setError(null);
    apiFetch<ListResponseWire<DemoCity>>(`/locations/regions/${encodeURIComponent(regionId)}/cities`)
      .then((res) => {
        if (!cancelled) setItems(normalizeListResponse(res));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load cities");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [regionId]);

  return { items, loading, error };
}
