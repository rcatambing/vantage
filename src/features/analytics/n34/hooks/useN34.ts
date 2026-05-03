import { useState, useEffect, useCallback } from "react";
import { fetchN34 } from "../api/n34Api";
import type { N34Data } from "../types";

export function useN34(campaignId: string) {
  const [data, setData] = useState<N34Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchN34({ campaign_id: campaignId });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load N34 data");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
