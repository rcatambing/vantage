/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { listResources } from "../api/resourceApi";
import type { Resource, ResourcesQueryParams } from "../types";

const PAGE_SIZE = 20;

export function useResourceList(
  params: Omit<ResourcesQueryParams, "skip" | "limit"> = {}
) {
  const [items, setItems] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);

  const fetchResources = useCallback(() => {
    setLoading(true);
    setError(null);
    listResources({ ...params, skip, limit: PAGE_SIZE })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load resources")
      )
      .finally(() => setLoading(false));
  }, [paramsKey, skip]);

  useEffect(() => {
    if (skip !== 0) {
      setSkip(0);
      return;
    }
    fetchResources();
  }, [paramsKey, skip, fetchResources]);

  return { items, total, skip, setSkip, loading, error, refetch: fetchResources };
}
