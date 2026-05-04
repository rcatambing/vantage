import { useState, useEffect, useCallback } from "react";
import { fetchActivities } from "../api/activityApi";
import type { ActivityListResponse, ActivityParams } from "../types";

export function useActivities(params: ActivityParams) {
  const [data, setData] = useState<ActivityListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!params.campaign_id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchActivities(params);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activities");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
