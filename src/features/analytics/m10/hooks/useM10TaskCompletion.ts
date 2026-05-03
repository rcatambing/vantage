import { useState, useEffect, useCallback } from "react";
import { fetchM10TaskCompletion } from "../api/m10Api";
import type { M10Response, M10Granularity } from "../types";

export interface M10Filters {
  objective_id?: string;
  assignee?: string[];
  task_type?: string[];
  from_date?: string;
  to_date?: string;
  granularity?: M10Granularity;
  timezone?: string;
  include_cancelled?: boolean;
}

export function useM10TaskCompletion(campaignId: string, filters: M10Filters = {}) {
  const [data, setData] = useState<M10Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM10TaskCompletion({
        campaign_id: campaignId,
        objective_id: filters.objective_id,
        assignee: filters.assignee,
        task_type: filters.task_type,
        from_date: filters.from_date,
        to_date: filters.to_date,
        granularity: filters.granularity,
        timezone: filters.timezone,
        include_cancelled: filters.include_cancelled,
      });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load task completion data");
    } finally {
      setLoading(false);
    }
  }, [
    campaignId,
    filters.objective_id,
    filters.assignee,
    filters.task_type,
    filters.from_date,
    filters.to_date,
    filters.granularity,
    filters.timezone,
    filters.include_cancelled,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
