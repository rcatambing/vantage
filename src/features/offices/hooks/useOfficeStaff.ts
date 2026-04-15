import { useState, useEffect, useCallback } from "react";
import { listOfficeStaff } from "../api/officeApi";
import type { OfficeStaffAssignment } from "../types";

export function useOfficeStaff(officeId: string | null) {
  const [staff, setStaff] = useState<OfficeStaffAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!officeId) return;
    setLoading(true);
    setError(null);
    listOfficeStaff(officeId)
      .then(setStaff)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load staff")
      )
      .finally(() => setLoading(false));
  }, [officeId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { staff, loading, error, refetch: reload };
}
