import { useState } from "react";
import { addEngagement } from "../api/leaderApi";
import type { AddEngagementPayload, LeaderEngagementEvent } from "../types";

export function useEngagementMutations() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function logEngagement(
    leaderId: string,
    payload: AddEngagementPayload
  ): Promise<LeaderEngagementEvent | null> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await addEngagement(leaderId, payload);
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log engagement");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return { logEngagement, submitting, error, clearError: () => setError(null) };
}
