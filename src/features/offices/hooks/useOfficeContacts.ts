import { useState, useEffect, useCallback } from "react";
import { listOfficeContacts } from "../api/officeApi";
import type { OfficeContact } from "../types";

export function useOfficeContacts(officeId: string | null) {
  const [contacts, setContacts] = useState<OfficeContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!officeId) return;
    setLoading(true);
    setError(null);
    listOfficeContacts(officeId)
      .then(setContacts)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load contacts")
      )
      .finally(() => setLoading(false));
  }, [officeId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { contacts, loading, error, refetch: reload };
}
