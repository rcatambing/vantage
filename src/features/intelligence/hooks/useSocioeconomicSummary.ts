import { useState, useEffect, useRef } from "react";
import { listSocioeconomicSummary } from "../api/intelligenceReadApi";
import type { PagedResponse, SocioeconomicSummaryRow } from "../types";

export interface UseSocioeconomicSummaryParams {
  district_id?: string;
  city_class?: string;
  income_bracket?: string;
  page?: number;
  page_size?: number;
}

export function useSocioeconomicSummary(
  campaignId: string | undefined,
  params: UseSocioeconomicSummaryParams = {},
) {
  const [data, setData] = useState<PagedResponse<SocioeconomicSummaryRow> | null>(
    null,
  );
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
    listSocioeconomicSummary(campaignId, params)
      .then((result) => {
        if (paramsKeyRef.current === paramsKey) setData(result);
      })
      .catch((e: unknown) => {
        if (paramsKeyRef.current === paramsKey) {
          setError(
            e instanceof Error
              ? e.message
              : "Failed to load socioeconomic summary.",
          );
        }
      })
      .finally(() => {
        if (paramsKeyRef.current === paramsKey) setLoading(false);
      });
  }, [campaignId, paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
