/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { listAffiliationTypes } from "../api/taxonomyApi";
import type { AffiliationTypeRef } from "../types";

export function useAffiliationTypes() {
  const [items, setItems] = useState<AffiliationTypeRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listAffiliationTypes()
      .then(setItems)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load affiliation types")
      )
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}
