/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { listSignalTypes } from "../api/taxonomyApi";
import type { SignalTypeRef } from "../types";

export function useSignalTypes() {
  const [items, setItems] = useState<SignalTypeRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listSignalTypes()
      .then(setItems)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load signal types")
      )
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}
