import { useState } from "react";
import { assignStaff, updateStaffRole, removeStaff } from "../api/officeApi";
import type { OfficeStaffAssignment, StaffAssignPayload, StaffRoleUpdatePayload } from "../types";

export function useOfficeStaffMutations(onSuccess?: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function assign(
    officeId: string,
    payload: StaffAssignPayload
  ): Promise<OfficeStaffAssignment | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await assignStaff(officeId, payload);
      onSuccess?.();
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assign failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function updateRole(
    officeId: string,
    userId: string,
    payload: StaffRoleUpdatePayload
  ): Promise<OfficeStaffAssignment | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateStaffRole(officeId, userId, payload);
      onSuccess?.();
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(officeId: string, userId: string): Promise<boolean> {
    setSubmitting(true);
    setError(null);
    try {
      await removeStaff(officeId, userId);
      onSuccess?.();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return { assign, updateRole, remove, submitting, error, clearError: () => setError(null) };
}
