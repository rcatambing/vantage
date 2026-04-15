import { useState } from "react";
import { assignResource, unassignResource, reassignResource } from "../api/resourceApi";
import type {
  ResourceAssignment,
  ResourceAssignPayload,
  ResourceReassignPayload,
  ResourceUnassignPayload,
} from "../types";

export function useResourceAssignmentMutations(onSuccess?: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function assign(
    resourceId: string,
    payload: ResourceAssignPayload
  ): Promise<ResourceAssignment | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await assignResource(resourceId, payload);
      onSuccess?.();
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assign failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function unassign(
    resourceId: string,
    payload: ResourceUnassignPayload = {}
  ): Promise<ResourceAssignment | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await unassignResource(resourceId, payload);
      onSuccess?.();
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unassign failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function reassign(
    resourceId: string,
    payload: ResourceReassignPayload
  ): Promise<ResourceAssignment | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await reassignResource(resourceId, payload);
      onSuccess?.();
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reassign failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return { assign, unassign, reassign, submitting, error, clearError: () => setError(null) };
}
