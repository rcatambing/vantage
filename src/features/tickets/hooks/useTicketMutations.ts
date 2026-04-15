import { useState } from "react";
import {
  createTicket,
  updateTicket,
  deleteTicket,
  addTicketRelationship,
  removeTicketRelationship,
} from "../api/ticketApi";
import { mapApiError, extractFieldErrors } from "../lib/errorMapping";
import type { TicketCreatePayload, TicketUpdatePayload } from "../types";

export interface UseTicketMutationsOptions {
  onSuccess?: () => void;
  onLocationMutationSuccess?: () => void;
}

export interface UseTicketMutationsResult {
  submitting: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  clearErrors: () => void;
  create: (payload: TicketCreatePayload) => Promise<boolean>;
  update: (id: string, payload: TicketUpdatePayload) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  addRelationship: (
    ticketId: string,
    payload: { kind: string; related_ticket_id: string },
  ) => Promise<boolean>;
  removeRelationship: (ticketId: string, relId: string) => Promise<boolean>;
}

export function useTicketMutations(
  options: UseTicketMutationsOptions = {},
): UseTicketMutationsResult {
  const { onSuccess, onLocationMutationSuccess } = options;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function clearErrors() {
    setError(null);
    setFieldErrors({});
  }

  async function withMutationLifecycle(
    fn: () => Promise<void>,
    locationMutation = false,
  ): Promise<boolean> {
    if (submitting) return false;
    setSubmitting(true);
    clearErrors();
    try {
      await fn();
      onSuccess?.();
      if (locationMutation) onLocationMutationSuccess?.();
      return true;
    } catch (e: unknown) {
      setError(mapApiError(e));
      const fields = extractFieldErrors(e);
      if (Object.keys(fields).length > 0) setFieldErrors(fields);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function create(payload: TicketCreatePayload): Promise<boolean> {
    const hasLocation = Boolean(payload.service_location);
    return withMutationLifecycle(
      () => createTicket(payload).then(() => void 0),
      hasLocation,
    );
  }

  async function update(
    id: string,
    payload: TicketUpdatePayload,
  ): Promise<boolean> {
    const isLocationMutation = Boolean(payload.service_location);
    return withMutationLifecycle(
      () => updateTicket(id, payload).then(() => void 0),
      isLocationMutation,
    );
  }

  async function remove(id: string): Promise<boolean> {
    return withMutationLifecycle(() => deleteTicket(id).then(() => void 0));
  }

  async function addRelationship(
    ticketId: string,
    payload: { kind: string; related_ticket_id: string },
  ): Promise<boolean> {
    return withMutationLifecycle(() =>
      addTicketRelationship(ticketId, payload).then(() => void 0),
    );
  }

  async function removeRelationship(
    ticketId: string,
    relId: string,
  ): Promise<boolean> {
    return withMutationLifecycle(() =>
      removeTicketRelationship(ticketId, relId),
    );
  }

  return {
    submitting,
    error,
    fieldErrors,
    clearErrors,
    create,
    update,
    remove,
    addRelationship,
    removeRelationship,
  };
}
