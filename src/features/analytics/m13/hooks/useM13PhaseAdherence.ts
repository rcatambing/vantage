import { useState, useEffect, useCallback } from "react";
import { fetchM13PhaseAdherence } from "../api/m13Api";
import type { M13Data } from "../types";

export function useM13PhaseAdherence(campaignId: string) {
  const [data, setData] = useState<M13Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchM13PhaseAdherence({ campaign_id: campaignId });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load phase adherence data");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
