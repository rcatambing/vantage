import { useState, useEffect, useCallback } from "react";
import { getResourceHistory } from "../api/resourceApi";
import type { ResourceAssignment } from "../types";

export function useResourceHistory(resourceId: string | null) {
  const [history, setHistory] = useState<ResourceAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!resourceId) return;
    setLoading(true);
    setError(null);
    getResourceHistory(resourceId)
      .then(setHistory)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load history")
      )
      .finally(() => setLoading(false));
  }, [resourceId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { history, loading, error, refetch: reload };
}
