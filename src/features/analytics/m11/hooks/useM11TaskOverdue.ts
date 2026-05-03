import { useState, useEffect, useCallback } from "react";
import { fetchM11TaskOverdue } from "../api/m11Api";
import type { M11Data, M11Params } from "../types";

export function useM11TaskOverdue(campaignId: string, filters: Omit<M11Params, "campaign_id"> = {}) {
  const [data, setData] = useState<M11Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM11TaskOverdue({ campaign_id: campaignId, ...filters });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load task overdue data");
    } finally {
      setLoading(false);
    }
  }, [campaignId, filters.objective_id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
