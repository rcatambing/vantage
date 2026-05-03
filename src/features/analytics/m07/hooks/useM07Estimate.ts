import { useCallback } from "react";
import { fetchM07Estimate } from "../api/m07Api";
import { useMetricFetch } from "../../hooks/useMetricFetch";
import type { M07EstimateResponse, ElectionType } from "../types";

export interface M07EstimateFilters {
  election_type?: ElectionType;
  election_cycle?: number;
  district_id?: string;
}

export function useM07Estimate(campaignId: string, filters: M07EstimateFilters = {}) {
  const fetcher = useCallback(
    () =>
      fetchM07Estimate({
        campaign_id: campaignId,
        election_type: filters.election_type,
        election_cycle: filters.election_cycle,
        district_id: filters.district_id,
      }),
    [campaignId, filters.election_type, filters.election_cycle, filters.district_id],
  );

  return useMetricFetch<M07EstimateResponse>(fetcher, [
    campaignId,
    filters.election_type,
    filters.election_cycle,
    filters.district_id,
  ]);
}
