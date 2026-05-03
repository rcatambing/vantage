import { useState, useEffect, useCallback } from "react";
import { fetchM25 } from "../api/m25Api";
import type { M25Data } from "../types";

export function useM25(campaignId: string, ourCandidate: string, candidates?: string) {
  const [data, setData] = useState<M25Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId || !ourCandidate) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM25({ campaign_id: campaignId, our_candidate: ourCandidate, candidates });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load head-to-head data");
    } finally {
      setLoading(false);
    }
  }, [campaignId, ourCandidate, candidates]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
