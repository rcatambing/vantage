/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { listOffices } from "../api/officeApi";
import type { Office, OfficesQueryParams } from "../types";

const PAGE_SIZE = 20;

export function useOfficeList(
  params: Omit<OfficesQueryParams, "skip" | "limit"> = {}
) {
  const [items, setItems] = useState<Office[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);

  const fetchOffices = useCallback(() => {
    setLoading(true);
    setError(null);
    listOffices({ ...params, skip, limit: PAGE_SIZE })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load offices")
      )
      .finally(() => setLoading(false));
  }, [paramsKey, skip]);

  useEffect(() => {
    if (skip !== 0) {
      setSkip(0);
      return;
    }
    fetchOffices();
  }, [paramsKey, skip, fetchOffices]);

  return { items, total, skip, setSkip, loading, error, refetch: fetchOffices };
}
