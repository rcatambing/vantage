import { useState } from "react";
import { createResource, updateResource, deleteResource } from "../api/resourceApi";
import type { Resource, ResourceCreatePayload, ResourceUpdatePayload } from "../types";

export function useResourceMutations() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(payload: ResourceCreatePayload): Promise<Resource | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createResource(payload);
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
    payload: ResourceUpdatePayload
  ): Promise<Resource | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateResource(id, payload);
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
      await deleteResource(id);
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
