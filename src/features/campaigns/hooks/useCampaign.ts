import { useState, useEffect, useCallback } from "react";
import { getCampaign } from "../api/campaignApi";
import type { Campaign } from "../types";

export function useCampaign(id: number) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaign = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCampaign(id);
      setCampaign(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  return { campaign, loading, error, refetch: loadCampaign };
}
