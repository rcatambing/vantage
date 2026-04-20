import { useState, useEffect, useCallback } from "react";
import { fetchMetricM04 } from "../api/metricsApi";
import type { MetricM04Response, MetricM04Filters } from "../types";

export function useMetricM04(filters?: MetricM04Filters) {
  const [data, setData] = useState<MetricM04Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetric = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMetricM04(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load metric");
    } finally {
      setLoading(false);
    }
  // filters is an object - identity changes only when state is updated in the parent
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    loadMetric();
  }, [loadMetric]);

  return { data, loading, error, refetch: loadMetric };
}
