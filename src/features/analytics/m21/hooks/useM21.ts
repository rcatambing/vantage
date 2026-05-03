import { useState, useEffect, useCallback } from "react";
import { fetchM21 } from "../api/m21Api";
import type { M21Data } from "../types";

export function useM21(campaignId: string, bucket = "week") {
  const [data, setData] = useState<M21Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM21({ campaign_id: campaignId, bucket });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sentiment trend data");
    } finally {
      setLoading(false);
    }
  }, [campaignId, bucket]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
