import { useState } from "react";
import { createAccount, updateAccount, deleteAccount } from "../api/accountApi";
import type { AccountCreatePayload, AccountUpdatePayload, CustomerAccount } from "../types";

export function useAccountMutations() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(
    payload: AccountCreatePayload
  ): Promise<CustomerAccount | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createAccount(payload);
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
    payload: AccountUpdatePayload
  ): Promise<CustomerAccount | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateAccount(id, payload);
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
      await deleteAccount(id);
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
