/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { listAffiliations } from "../api/taxonomyApi";
import type { AffiliationRef } from "../types";

let lastAffiliationRequest = 0;

export function useAffiliations(affiliationTypeId: string | undefined) {
  const [items, setItems] = useState<AffiliationRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!affiliationTypeId) {
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }

    const requestId = ++lastAffiliationRequest;
    setLoading(true);
    setError(null);
    listAffiliations({ affiliation_type_id: affiliationTypeId })
      .then((result) => {
        if (requestId === lastAffiliationRequest) {
          setItems(result);
        }
      })
      .catch((e: unknown) => {
        if (requestId === lastAffiliationRequest) {
          setError(e instanceof Error ? e.message : "Failed to load affiliations");
        }
      })
      .finally(() => {
        if (requestId === lastAffiliationRequest) {
          setLoading(false);
        }
      });
  }, [affiliationTypeId]);

  return { items, loading, error };
}
