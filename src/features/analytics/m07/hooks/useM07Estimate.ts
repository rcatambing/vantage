import { useState, useEffect, useCallback } from "react";
import { fetchM07Estimate } from "../api/m07Api";
import type { M07EstimateResponse, ElectionType } from "../types";

export interface M07EstimateFilters {
  election_type?: ElectionType;
  election_cycle?: number;
  district_id?: string;
}

export function useM07Estimate(campaignId: string, filters: M07EstimateFilters = {}) {
  const [data, setData] = useState<M07EstimateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM07Estimate({
        campaign_id: campaignId,
        election_type: filters.election_type,
        election_cycle: filters.election_cycle,
        district_id: filters.district_id,
      });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load turnout estimate");
    } finally {
      setLoading(false);
    }
  }, [campaignId, filters.election_type, filters.election_cycle, filters.district_id]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
