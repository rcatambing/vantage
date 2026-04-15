import { useState } from "react";
import {
  createAccountSignal,
  updateAccountSignal,
  deleteAccountSignal,
} from "../api/accountSignalApi";
import type {
  AccountSignal,
  AccountSignalCreatePayload,
  AccountSignalUpdatePayload,
} from "../types";

export function useAccountSignalMutations(onSuccess?: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(
    accountId: string,
    payload: AccountSignalCreatePayload
  ): Promise<AccountSignal | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createAccountSignal(accountId, payload);
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
    signalId: string,
    payload: AccountSignalUpdatePayload
  ): Promise<AccountSignal | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateAccountSignal(accountId, signalId, payload);
      onSuccess?.();
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(accountId: string, signalId: string): Promise<boolean> {
    setSubmitting(true);
    setError(null);
    try {
      await deleteAccountSignal(accountId, signalId);
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
