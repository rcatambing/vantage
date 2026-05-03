import { useState, useEffect, useCallback } from "react";
import { fetchM26 } from "../api/m26Api";
import type { M26Data } from "../types";

export function useM26(
  campaignId: string,
  ourCandidate: string,
  opponentCandidate: string,
  confidenceLevel?: number,
) {
  const [data, setData] = useState<M26Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId || !ourCandidate || !opponentCandidate) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM26({
        campaign_id: campaignId,
        our_candidate: ourCandidate,
        opponent_candidate: opponentCandidate,
        confidence_level: confidenceLevel,
      });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load margin of victory data");
    } finally {
      setLoading(false);
    }
  }, [campaignId, ourCandidate, opponentCandidate, confidenceLevel]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
