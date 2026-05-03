import { useState, useEffect, useRef } from "react";
import { getPersuasionFunnel } from "../api/intelligenceReadApi";
import type { PersuasionFunnelRow } from "../types";

export interface UsePersuasionFunnelParams {
  snapshot_date?: string;
  district_id?: string;
}

export function usePersuasionFunnel(
  campaignId: string | undefined,
  params: UsePersuasionFunnelParams = {},
) {
  const [data, setData] = useState<PersuasionFunnelRow[] | null>(null);
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
    getPersuasionFunnel(campaignId, params)
      .then((result) => {
        if (paramsKeyRef.current === paramsKey) setData(result);
      })
      .catch((e: unknown) => {
        if (paramsKeyRef.current === paramsKey) {
          setError(
            e instanceof Error ? e.message : "Failed to load persuasion funnel.",
          );
        }
      })
      .finally(() => {
        if (paramsKeyRef.current === paramsKey) setLoading(false);
      });
  }, [campaignId, paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
