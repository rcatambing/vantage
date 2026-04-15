import { useState } from "react";
import { createLeader, updateLeader, deleteLeader } from "../api/leaderApi";
import type { LeaderCreatePayload, LeaderUpdatePayload, CommunityLeader } from "../types";

export function useLeaderMutations() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(
    payload: LeaderCreatePayload
  ): Promise<CommunityLeader | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createLeader(payload);
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
    payload: LeaderUpdatePayload
  ): Promise<CommunityLeader | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateLeader(id, payload);
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
      await deleteLeader(id);
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
