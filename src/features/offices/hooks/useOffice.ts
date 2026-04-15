import { useState, useEffect, useCallback } from "react";
import { getOffice } from "../api/officeApi";
import type { Office } from "../types";

export function useOffice(id: string) {
  const [office, setOffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOffice = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOffice(id);
      setOffice(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load office");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOffice();
  }, [loadOffice]);

  return { office, loading, error, refetch: loadOffice };
}
