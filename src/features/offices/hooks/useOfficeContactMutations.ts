import { useState } from "react";
import {
  createOfficeContact,
  updateOfficeContact,
  deleteOfficeContact,
  setPrimaryContact,
} from "../api/officeApi";
import type { OfficeContact, ContactCreatePayload, ContactUpdatePayload } from "../types";

export function useOfficeContactMutations(onSuccess?: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(
    officeId: string,
    payload: ContactCreatePayload
  ): Promise<OfficeContact | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createOfficeContact(officeId, payload);
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
    officeId: string,
    contactId: string,
    payload: ContactUpdatePayload
  ): Promise<OfficeContact | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateOfficeContact(officeId, contactId, payload);
      onSuccess?.();
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(officeId: string, contactId: string): Promise<boolean> {
    setSubmitting(true);
    setError(null);
    try {
      await deleteOfficeContact(officeId, contactId);
      onSuccess?.();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function setPrimary(
    officeId: string,
    contactId: string
  ): Promise<OfficeContact | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await setPrimaryContact(officeId, contactId);
      onSuccess?.();
      return res;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set primary");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return { create, update, remove, setPrimary, submitting, error, clearError: () => setError(null) };
}
