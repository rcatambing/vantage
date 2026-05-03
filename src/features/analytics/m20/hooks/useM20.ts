import { useState, useEffect, useCallback } from "react";
import { fetchM20 } from "../api/m20Api";
import type { M20Data } from "../types";

export function useM20(campaignId: string, limit = 10) {
  const [data, setData] = useState<M20Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM20({ campaign_id: campaignId, limit });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load issue salience data");
    } finally {
      setLoading(false);
    }
  }, [campaignId, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
