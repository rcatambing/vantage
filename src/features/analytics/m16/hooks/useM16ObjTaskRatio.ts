import { useState, useEffect, useCallback } from "react";
import { fetchM16ObjTaskRatio } from "../api/m16Api";
import type { M16Data } from "../types";

export function useM16ObjTaskRatio(campaignId: string) {
  const [data, setData] = useState<M16Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM16ObjTaskRatio({ campaign_id: campaignId });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load objective-task ratio data");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
