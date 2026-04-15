import { useState, useEffect, useCallback } from "react";
import { listCampaigns } from "../api/campaignApi";
import type { Campaign } from "../types";

export function useCampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  return { campaigns, loading, error, refetch: loadCampaigns };
}
