import { useState } from "react";
import { recomputeCompositesJob } from "../api/intelligenceJobsApi";

export interface UseRecomputeCompositesJobResult {
  submitting: boolean;
  error: string | null;
  result: { message: string; rows_written: number; algorithm_version: string } | null;
  run: (payload: { campaign_id?: string | null; dry_run?: boolean }) => Promise<boolean>;
  clear: () => void;
}

export function useRecomputeCompositesJob(): UseRecomputeCompositesJobResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ message: string; rows_written: number; algorithm_version: string } | null>(null);

  function clear() {
    setError(null);
    setResult(null);
  }

  async function run(payload: { campaign_id?: string | null; dry_run?: boolean }): Promise<boolean> {
    if (submitting) return false;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await recomputeCompositesJob(payload);
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
