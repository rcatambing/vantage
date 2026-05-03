import { useState, useEffect, useCallback } from "react";
import { fetchN31 } from "../api/n31Api";
import type { N31Data } from "../types";

export function useN31(campaignId: string) {
  const [data, setData] = useState<N31Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchN31({ campaign_id: campaignId });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load N31 data");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
