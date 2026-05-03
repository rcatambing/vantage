import { useState, useEffect, useRef } from "react";
import { listVoterComposites } from "../api/intelligenceReadApi";
import type { PagedResponse, VoterCompositeRow } from "../types";

export interface UseVoterCompositesParams {
  district_id?: string;
  persuasion_stage?: string;
  min_cwss?: number;
  max_cwss?: number;
  min_freshness?: number;
  page?: number;
  page_size?: number;
}

export function useVoterComposites(
  campaignId: string | undefined,
  params: UseVoterCompositesParams = {},
) {
  const [data, setData] = useState<PagedResponse<VoterCompositeRow> | null>(
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
    listVoterComposites(campaignId, params)
      .then((result) => {
        if (paramsKeyRef.current === paramsKey) setData(result);
      })
      .catch((e: unknown) => {
        if (paramsKeyRef.current === paramsKey) {
          setError(
            e instanceof Error ? e.message : "Failed to load voter composites.",
          );
        }
      })
      .finally(() => {
        if (paramsKeyRef.current === paramsKey) setLoading(false);
      });
  }, [campaignId, paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
