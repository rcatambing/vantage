/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { listAccountAffiliations } from "../api/accountAffiliationApi";
import type { AccountAffiliation } from "../types";

export function useAccountAffiliations(accountId: string | undefined) {
  const [affiliations, setAffiliations] = useState<AccountAffiliation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!accountId) return;
    setLoading(true);
    setError(null);
    listAccountAffiliations(accountId, { active_only: true })
      .then(setAffiliations)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load affiliations")
      )
      .finally(() => setLoading(false));
  }, [accountId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const onDemoDataUpdated = () => reload();
    window.addEventListener("vantage-demo-data-updated", onDemoDataUpdated);
    return () => window.removeEventListener("vantage-demo-data-updated", onDemoDataUpdated);
  }, [reload]);

  return { affiliations, loading, error, reload };
}
