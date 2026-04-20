import { useState, useEffect, useCallback } from "react";
import { fetchMetricM01 } from "../api/metricsApi";
import type { MetricResponse, MetricFilters } from "../types";

export function useMetricM01(filters?: MetricFilters) {
  const [data, setData] = useState<MetricResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetric = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMetricM01(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load metric");
      setData(null);
    } finally {
      setLoading(false);
    }
  // filters is an object — identity changes only when state is updated in the parent
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    loadMetric();
  }, [loadMetric]);

  return { data, loading, error, refetch: loadMetric };
}
