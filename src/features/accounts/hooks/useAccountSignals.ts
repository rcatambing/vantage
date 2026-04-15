/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { listAccountSignals } from "../api/accountSignalApi";
import type { AccountSignal } from "../types";

export function useAccountSignals(accountId: string | undefined) {
  const [signals, setSignals] = useState<AccountSignal[]>([]);
  const [showExpired, setShowExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!accountId) return;
    setLoading(true);
    setError(null);
    listAccountSignals(accountId, { active_only: !showExpired })
      .then((res) => setSignals(res.items))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load signals")
      )
      .finally(() => setLoading(false));
  }, [accountId, showExpired]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const onDemoDataUpdated = () => reload();
    window.addEventListener("vantage-demo-data-updated", onDemoDataUpdated);
    return () => window.removeEventListener("vantage-demo-data-updated", onDemoDataUpdated);
  }, [reload]);

  return { signals, loading, error, showExpired, setShowExpired, reload };
}
