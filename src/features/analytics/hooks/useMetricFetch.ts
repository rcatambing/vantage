import { useState, useEffect, useCallback, useRef } from "react";

export interface MetricFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface MetricFetchResult<T> extends MetricFetchState<T> {
  refetch: () => void;
}

/**
 * Generic data-fetching hook for analytics metric endpoints.
 * Handles loading, error, and refetch states with AbortController
 * for safe cancellation on unmount or dependency change.
 *
 * @param fetcher - Async function that returns T
 * @param deps - Dependency array that triggers a refetch when changed
 *
 * @example
 * const { data, loading, error, refetch } = useMetricFetch(
 *   () => fetchM07Estimate(params),
 *   [params.campaign_id, params.election_type]
 * );
 */
export function useMetricFetch<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList,
): MetricFetchResult<T> {
  const [state, setState] = useState<MetricFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(() => {
    const controller = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcherRef
      .current()
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load data",
          });
        }
      });

    return controller;
  }, []);

  useEffect(() => {
    const controller = load();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    ...state,
    refetch: load,
  };
}
