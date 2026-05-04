import { useState, useEffect, useRef, useCallback } from "react";
import {
  getAnecdotes,
  getAnecdote,
  createAnecdote,
  updateAnecdote,
  deleteAnecdote,
  submitCanvass,
  syncOfflineQueue,
} from "../api/intelApi";
import {
  getQueue,
  removeFromQueue,
  markSynced,
} from "../lib/offlineStorage";
import type {
  Anecdote,
  AnecdoteFilters,
  PaginatedAnecdotes,
  AnecdoteCreatePayload,
  AnecdoteUpdatePayload,
  CanvassSubmitPayload,
  OfflineQueueItem,
} from "../types";

// ---------------------------------------------------------------------------
// useAnecdoteList
// ---------------------------------------------------------------------------

export function useAnecdoteList(
  campaignId: string | undefined,
  filters: AnecdoteFilters = {},
) {
  const [data, setData] = useState<PaginatedAnecdotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify({ campaignId, ...filters });
  const paramsKeyRef = useRef(paramsKey);

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      return;
    }
    paramsKeyRef.current = paramsKey;
    setLoading(true);
    setError(null);
    getAnecdotes(campaignId, filters)
      .then((result) => {
        if (paramsKeyRef.current === paramsKey) setData(result);
      })
      .catch((e: unknown) => {
        if (paramsKeyRef.current === paramsKey) {
          setError(e instanceof Error ? e.message : "Failed to load anecdotes.");
        }
      })
      .finally(() => {
        if (paramsKeyRef.current === paramsKey) setLoading(false);
      });
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}

// ---------------------------------------------------------------------------
// useAnecdote
// ---------------------------------------------------------------------------

export interface UseAnecdoteResult {
  anecdote: Anecdote | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnecdote(anecdoteId: string | undefined): UseAnecdoteResult {
  const [anecdote, setAnecdote] = useState<Anecdote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!anecdoteId) {
      setLoading(false);
      return;
    }
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    setLoading(true);
    setError(null);
    getAnecdote(anecdoteId)
      .then((value) => {
        if (requestIdRef.current === requestId) setAnecdote(value);
      })
      .catch((e: unknown) => {
        if (requestIdRef.current === requestId) {
          setError(e instanceof Error ? e.message : "Failed to load anecdote.");
        }
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoading(false);
      });
  }, [anecdoteId, fetchCount]);

  function refetch() {
    setFetchCount((n) => n + 1);
  }

  return { anecdote, loading, error, refetch };
}

// ---------------------------------------------------------------------------
// useAnecdoteMutations
// ---------------------------------------------------------------------------

export interface UseAnecdoteMutationsResult {
  create: (payload: AnecdoteCreatePayload) => Promise<boolean>;
  update: (id: string, payload: AnecdoteUpdatePayload) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  submitting: boolean;
  error: string | null;
  clearErrors: () => void;
}

export function useAnecdoteMutations(options?: {
  onSuccess?: () => void;
}): UseAnecdoteMutationsResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearErrors = useCallback(() => setError(null), []);

  const create = useCallback(
    async (payload: AnecdoteCreatePayload) => {
      setSubmitting(true);
      setError(null);
      try {
        await createAnecdote(payload);
        options?.onSuccess?.();
        return true;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to create anecdote.");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [options],
  );

  const update = useCallback(
    async (id: string, payload: AnecdoteUpdatePayload) => {
      setSubmitting(true);
      setError(null);
      try {
        await updateAnecdote(id, payload);
        options?.onSuccess?.();
        return true;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update anecdote.");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [options],
  );

  const remove = useCallback(
    async (id: string) => {
      setSubmitting(true);
      setError(null);
      try {
        await deleteAnecdote(id);
        options?.onSuccess?.();
        return true;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to delete anecdote.");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [options],
  );

  return { create, update, remove, submitting, error, clearErrors };
}

// ---------------------------------------------------------------------------
// useCanvassSubmit
// ---------------------------------------------------------------------------

export interface UseCanvassSubmitResult {
  submit: (payload: CanvassSubmitPayload) => Promise<boolean>;
  submitting: boolean;
  error: string | null;
  clearErrors: () => void;
}

export function useCanvassSubmit(options?: {
  onSuccess?: () => void;
}): UseCanvassSubmitResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearErrors = useCallback(() => setError(null), []);

  const submit = useCallback(
    async (payload: CanvassSubmitPayload) => {
      setSubmitting(true);
      setError(null);
      try {
        await submitCanvass(payload);
        options?.onSuccess?.();
        return true;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to submit canvass.");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [options],
  );

  return { submit, submitting, error, clearErrors };
}

// ---------------------------------------------------------------------------
// useOfflineQueue
// ---------------------------------------------------------------------------

export interface UseOfflineQueueResult {
  queue: OfflineQueueItem[];
  loading: boolean;
  sync: () => Promise<void>;
  syncing: boolean;
  syncError: string | null;
  refresh: () => void;
  removeItem: (id: string) => Promise<void>;
}

export function useOfflineQueue(): UseOfflineQueueResult {
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    getQueue()
      .then((items) => {
        setQueue(items as OfflineQueueItem[]);
      })
      .catch(() => {
        setQueue([]);
      })
      .finally(() => setLoading(false));
  }, [refreshCount]);

  const refresh = useCallback(() => setRefreshCount((n) => n + 1), []);

  const sync = useCallback(async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      const items = await getQueue();
      if (items.length === 0) {
        setSyncing(false);
        return;
      }
      const result = await syncOfflineQueue(items as OfflineQueueItem[]);
      if (result.synced > 0) {
        for (const item of items.slice(0, result.synced)) {
          await markSynced(item.id);
        }
      }
      refresh();
    } catch (e: unknown) {
      setSyncError(e instanceof Error ? e.message : "Sync failed.");
    } finally {
      setSyncing(false);
    }
  }, [refresh]);

  const removeItem = useCallback(async (id: string) => {
    await removeFromQueue(id);
    refresh();
  }, [refresh]);

  return { queue, loading, sync, syncing, syncError, refresh, removeItem };
}
