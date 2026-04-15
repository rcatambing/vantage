/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { getLeader, getEngagement } from "../api/leaderApi";
import type { CommunityLeader, LeaderEngagementEvent } from "../types";

export function useLeader(id: string | undefined) {
  const [leader, setLeader] = useState<CommunityLeader | null>(null);
  const [engagement, setEngagement] = useState<LeaderEngagementEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!id) {
      setLeader(null);
      setEngagement([]);
      setError("Missing leader ID");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([getLeader(id), getEngagement(id)])
      .then(([l, e]) => {
        setLeader(l);
        setEngagement(e);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load leader")
      )
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { leader, engagement, loading, error, reload };
}
