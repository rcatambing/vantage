import { useState, useEffect, useCallback } from "react";
import { fetchM07History } from "../api/m07Api";
import type { M07HistoryItem, ElectionType } from "../types";

export interface M07HistoryFilters {
  election_type?: ElectionType;
  year_from?: number;
  year_to?: number;
  district_id?: string;
  page: number;
}

const PAGE_SIZE = 25;

export function useM07History(campaignId: string) {
  const [items, setItems] = useState<M07HistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<M07HistoryFilters>({ page: 1 });

  const load = useCallback(
    async (f: M07HistoryFilters) => {
      if (!campaignId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetchM07History({
          campaign_id: campaignId,
          election_type: f.election_type,
          year_from: f.year_from,
          year_to: f.year_to,
          district_id: f.district_id,
          page: f.page,
          page_size: PAGE_SIZE,
        });
        setItems(res.items);
        setTotal(res.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load history");
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [campaignId]
  );

  useEffect(() => {
    load(filters);
  }, [load, filters]);

  const applyFilters = useCallback((next: Partial<M07HistoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...next, page: 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    items,
    total,
    totalPages,
    loading,
    error,
    filters,
    applyFilters,
    goToPage,
    refetch: () => load(filters),
  };
}
