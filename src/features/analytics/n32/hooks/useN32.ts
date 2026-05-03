import { useState, useEffect, useCallback } from "react";
import { fetchN32 } from "../api/n32Api";
import type { N32Data } from "../types";

export function useN32(campaignId: string) {
  const [data, setData] = useState<N32Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchN32({ campaign_id: campaignId });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load N32 data");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
