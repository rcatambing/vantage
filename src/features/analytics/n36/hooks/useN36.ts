import { useState, useEffect, useCallback } from "react";
import { fetchN36 } from "../api/n36Api";
import type { N36Data } from "../types";

export function useN36(campaignId: string) {
  const [data, setData] = useState<N36Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchN36({ campaign_id: campaignId });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load N36 data");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
