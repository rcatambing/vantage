/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { listAccounts } from "../api/accountApi";
import type { CustomerAccount, AccountsQueryParams, PaginatedAccounts } from "../types";

const PAGE_SIZE = 20;

export function useAccounts(
  params: Omit<AccountsQueryParams, "page" | "page_size"> = {}
) {
  const [items, setItems] = useState<CustomerAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);

  const fetchAccounts = useCallback(() => {
    setLoading(true);
    setError(null);
    listAccounts({ ...params, page, page_size: PAGE_SIZE })
      .then((res: PaginatedAccounts) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load accounts")
      )
      .finally(() => setLoading(false));
  }, [paramsKey, page]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
      return;
    }
    fetchAccounts();
  }, [paramsKey, page, fetchAccounts]);

  useEffect(() => {
    const onDemoDataUpdated = () => fetchAccounts();
    window.addEventListener("vantage-demo-data-updated", onDemoDataUpdated);
    return () => window.removeEventListener("vantage-demo-data-updated", onDemoDataUpdated);
  }, [fetchAccounts]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return { items, total, page, setPage, totalPages, loading, error, refetch: fetchAccounts };
}
