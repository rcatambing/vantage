import { useState, useEffect, useCallback } from "react";
import { fetchJobs } from "../api/jobApi";
import type { JobListResponse } from "../types";

export function useJobs(category?: string) {
  const [data, setData] = useState<JobListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchJobs(category);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
