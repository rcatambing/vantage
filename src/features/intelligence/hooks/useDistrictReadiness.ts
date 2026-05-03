import { useState, useEffect, useRef } from "react";
import { listDistrictReadiness } from "../api/intelligenceReadApi";
import type { DistrictReadinessRow } from "../types";

export interface UseDistrictReadinessParams {
  district_id?: string;
  min_readiness_score?: number;
}

export function useDistrictReadiness(
  campaignId: string | undefined,
  params: UseDistrictReadinessParams = {},
) {
  const [data, setData] = useState<DistrictReadinessRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);
  const paramsKeyRef = useRef(paramsKey);

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      return;
    }
    paramsKeyRef.current = paramsKey;
    setLoading(true);
    setError(null);
    listDistrictReadiness(campaignId, params)
      .then((result) => {
        if (paramsKeyRef.current === paramsKey) setData(result);
      })
      .catch((e: unknown) => {
        if (paramsKeyRef.current === paramsKey) {
          setError(
            e instanceof Error ? e.message : "Failed to load district readiness.",
          );
        }
      })
      .finally(() => {
        if (paramsKeyRef.current === paramsKey) setLoading(false);
      });
  }, [campaignId, paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
