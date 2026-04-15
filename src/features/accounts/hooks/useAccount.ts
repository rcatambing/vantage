import { useState, useEffect, useCallback } from "react";
import { getAccount } from "../api/accountApi";
import type { CustomerAccount } from "../types";

export function useAccount(id: string | undefined) {
  const [account, setAccount] = useState<CustomerAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!id) {
      setAccount(null);
      setError("Missing account ID");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getAccount(id)
      .then(setAccount)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load account")
      )
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const onDemoDataUpdated = () => reload();
    window.addEventListener("vantage-demo-data-updated", onDemoDataUpdated);
    return () => window.removeEventListener("vantage-demo-data-updated", onDemoDataUpdated);
  }, [reload]);

  return { account, loading, error, reload };
}
