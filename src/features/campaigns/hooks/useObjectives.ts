import { useState, useEffect, useCallback } from "react";
import { getDiagnostics } from "../api/campaignApi";
import type { DiagnosticsResponse, Objective } from "../types";

/**
 * Fetches the campaign diagnostics (which includes enriched objectives with progress,
 * task counts, orphan flags, and diagnostic warnings). A single request replaces
 * separate calls to /objectives and /diagnostics.
 */
export function useObjectives(campaignId: number | null) {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadObjectives = useCallback(async () => {
    if (campaignId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getDiagnostics(campaignId);
      setDiagnostics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load objectives");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    loadObjectives();
  }, [loadObjectives]);

  const objectives: Objective[] = diagnostics?.objectives ?? [];
  return { objectives, diagnostics, loading, error, refetch: loadObjectives };
}
