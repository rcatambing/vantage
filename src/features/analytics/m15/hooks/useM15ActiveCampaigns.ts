import { useState, useEffect, useCallback } from "react";
import { fetchM15ActiveCampaigns } from "../api/m15Api";
import type { M15Data, M15Params } from "../types";

export function useM15ActiveCampaigns(filters: M15Params = {}) {
  const [data, setData] = useState<M15Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM15ActiveCampaigns(filters);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load active campaign data");
    } finally {
      setLoading(false);
    }
  }, [filters.campaign_type]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
