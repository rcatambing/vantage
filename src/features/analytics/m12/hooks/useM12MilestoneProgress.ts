import { useState, useEffect, useCallback } from "react";
import { fetchM12MilestoneProgress } from "../api/m12Api";
import type { M12Data, M12Params } from "../types";

export function useM12MilestoneProgress(
  campaignId: string,
  filters: Omit<M12Params, "campaign_id"> = {}
) {
  const [data, setData] = useState<M12Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM12MilestoneProgress({ campaign_id: campaignId, ...filters });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load milestone progress data");
    } finally {
      setLoading(false);
    }
  }, [campaignId, filters.task_id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
