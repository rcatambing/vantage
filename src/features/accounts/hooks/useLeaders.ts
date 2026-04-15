/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { listLeaders } from "../api/leaderApi";
import type { CommunityLeader, LeadersQueryParams, PaginatedLeaders } from "../types";

const PAGE_SIZE = 20;

export function useLeaders(params: Omit<LeadersQueryParams, "page" | "page_size"> = {}) {
  const [items, setItems] = useState<CommunityLeader[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Serialise params to catch reference changes
  const paramsKey = JSON.stringify(params);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [paramsKey]);

  const fetchLeaders = useCallback(() => {
    setLoading(true);
    setError(null);
    listLeaders({ ...params, page, page_size: PAGE_SIZE })
      .then((res: PaginatedLeaders) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load leaders")
      )
      .finally(() => setLoading(false));
  }, [paramsKey, page]);

  useEffect(() => {
    fetchLeaders();
  }, [fetchLeaders]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return { items, total, page, setPage, totalPages, loading, error, refetch: fetchLeaders };
}
