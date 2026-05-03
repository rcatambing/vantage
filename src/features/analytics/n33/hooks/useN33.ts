import { useState, useEffect, useCallback } from "react";
import { fetchN33 } from "../api/n33Api";
import type { N33Data } from "../types";

export function useN33(campaignId: string) {
  const [data, setData] = useState<N33Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchN33({ campaign_id: campaignId });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load N33 data");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
