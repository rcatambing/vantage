import { useState } from "react";
import { createOffice, updateOffice, deleteOffice } from "../api/officeApi";
import type { Office, OfficeCreatePayload, OfficeUpdatePayload } from "../types";

export function useOfficeMutations() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(payload: OfficeCreatePayload): Promise<Office | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createOffice(payload);
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function update(
    id: string,
    payload: OfficeUpdatePayload
  ): Promise<Office | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateOffice(id, payload);
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string): Promise<boolean> {
    setSubmitting(true);
    setError(null);
    try {
      await deleteOffice(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return { create, update, remove, submitting, error, clearError: () => setError(null) };
}
