import { useState } from "react";
import { refreshSemanticLayerJob } from "../api/intelligenceJobsApi";

export interface UseRefreshSemanticLayerJobResult {
  submitting: boolean;
  error: string | null;
  result: { message: string } | null;
  run: (payload: { campaign_id?: string | null }) => Promise<boolean>;
  clear: () => void;
}

export function useRefreshSemanticLayerJob(): UseRefreshSemanticLayerJobResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ message: string } | null>(null);

  function clear() {
    setError(null);
    setResult(null);
  }

  async function run(payload: { campaign_id?: string | null }): Promise<boolean> {
    if (submitting) return false;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await refreshSemanticLayerJob(payload);
      setResult(res);
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Job failed.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return { submitting, error, result, run, clear };
}
