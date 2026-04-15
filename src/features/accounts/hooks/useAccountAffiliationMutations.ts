import { useState } from "react";
import {
  createAccountAffiliation,
  updateAccountAffiliation,
  deleteAccountAffiliation,
} from "../api/accountAffiliationApi";
import type {
  AccountAffiliation,
  AccountAffiliationCreatePayload,
  AccountAffiliationUpdatePayload,
} from "../types";

export function useAccountAffiliationMutations(onSuccess?: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(
    accountId: string,
    payload: AccountAffiliationCreatePayload
  ): Promise<AccountAffiliation | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createAccountAffiliation(accountId, payload);
      onSuccess?.();
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function update(
    accountId: string,
    id: string,
    payload: AccountAffiliationUpdatePayload
  ): Promise<AccountAffiliation | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateAccountAffiliation(accountId, id, payload);
      onSuccess?.();
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(accountId: string, id: string): Promise<boolean> {
    setSubmitting(true);
    setError(null);
    try {
      await deleteAccountAffiliation(accountId, id);
      onSuccess?.();
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
