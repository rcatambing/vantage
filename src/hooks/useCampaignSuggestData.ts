import { useState, useEffect } from "react";
import { isDemoModeEnabled, DEMO_CAMPAIGNS } from "../features/accounts/demoData";
import { apiFetch } from "../lib/api/client";
import { normalizeListResponse, type ListResponseWire } from "../lib/api/responseShape";

export interface CampaignOption {
  id: string;
  name: string;
  campaign_type: string;
}

export function useCampaignSuggestData() {
  const [items, setItems] = useState<CampaignOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoModeEnabled()) {
      setItems(DEMO_CAMPAIGNS);
      setLoading(false);
      return;
    }
    let cancelled = false;
    apiFetch<ListResponseWire<CampaignOption>>("/campaigns?page_size=200")
      .then((res) => {
        if (!cancelled) setItems(normalizeListResponse(res));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load campaigns");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}
