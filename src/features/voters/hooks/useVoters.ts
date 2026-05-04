import { useState, useEffect, useRef } from "react";
import {
  getVoters,
  getVoter,
  createVoter,
  updateVoter,
  deleteVoter,
  importVoters,
} from "../api/voterApi";
import type {
  Voter,
  VoterFilters,
  PaginatedVoters,
  VoterCreatePayload,
  VoterUpdatePayload,
  VoterImportResult,
} from "../types";

// ---------------------------------------------------------------------------
// useVoterList
// ---------------------------------------------------------------------------

export function useVoterList(campaignId: string | undefined, filters: VoterFilters = {}) {
  const [data, setData] = useState<PaginatedVoters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify({ campaignId, ...filters });
  const paramsKeyRef = useRef(paramsKey);

  useEffect(() => {
    paramsKeyRef.current = paramsKey;
    setLoading(true);
    setError(null);
    getVoters({ ...filters, campaign_id: campaignId })
      .then((result) => {
        if (paramsKeyRef.current === paramsKey) setData(result);
      })
      .catch((e: unknown) => {
        if (paramsKeyRef.current === paramsKey) {
          setError(e instanceof Error ? e.message : "Failed to load voters.");
        }
      })
      .finally(() => {
        if (paramsKeyRef.current === paramsKey) setLoading(false);
      });
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}

// ---------------------------------------------------------------------------
// useVoter
// ---------------------------------------------------------------------------

export interface UseVoterResult {
  voter: Voter | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVoter(voterId: string | undefined): UseVoterResult {
  const [voter, setVoter] = useState<Voter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!voterId) {
      setLoading(false);
      return;
    }
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    setLoading(true);
    setError(null);
    getVoter(voterId)
      .then((value) => {
        if (requestIdRef.current === requestId) setVoter(value);
      })
      .catch((e: unknown) => {
        if (requestIdRef.current === requestId) {
          setError(e instanceof Error ? e.message : "Failed to load voter.");
        }
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoading(false);
      });
  }, [voterId, fetchCount]);

  function refetch() {
    setFetchCount((n) => n + 1);
  }

  return { voter, loading, error, refetch };
}

// ---------------------------------------------------------------------------
// useVoterMutations
// ---------------------------------------------------------------------------

export interface UseVoterMutationsOptions {
  onSuccess?: () => void;
}

export interface UseVoterMutationsResult {
  submitting: boolean;
  error: string | null;
  clearErrors: () => void;
  create: (payload: VoterCreatePayload) => Promise<boolean>;
  update: (id: string, payload: VoterUpdatePayload) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
}

export function useVoterMutations(
  options: UseVoterMutationsOptions = {},
): UseVoterMutationsResult {
  const { onSuccess } = options;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearErrors() {
    setError(null);
  }

  async function withMutationLifecycle(
    fn: () => Promise<void>,
  ): Promise<boolean> {
    if (submitting) return false;
    setSubmitting(true);
    clearErrors();
    try {
      await fn();
      onSuccess?.();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function create(payload: VoterCreatePayload): Promise<boolean> {
    return withMutationLifecycle(() => createVoter(payload).then(() => void 0));
  }

  async function update(id: string, payload: VoterUpdatePayload): Promise<boolean> {
    return withMutationLifecycle(() => updateVoter(id, payload).then(() => void 0));
  }

  async function remove(id: string): Promise<boolean> {
    return withMutationLifecycle(() => deleteVoter(id).then(() => void 0));
  }

  return { submitting, error, clearErrors, create, update, remove };
}

// ---------------------------------------------------------------------------
// useVoterImport
// ---------------------------------------------------------------------------

export interface UseVoterImportResult {
  importing: boolean;
  result: VoterImportResult | null;
  error: string | null;
  clear: () => void;
  importFile: (file: File, campaignId: string) => Promise<boolean>;
}

export function useVoterImport(): UseVoterImportResult {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<VoterImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function clear() {
    setResult(null);
    setError(null);
  }

  async function importFile(file: File, campaignId: string): Promise<boolean> {
    setImporting(true);
    setError(null);
    setResult(null);
    try {
      const data = await importVoters(file, campaignId);
      setResult(data);
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Import failed.");
      return false;
    } finally {
      setImporting(false);
    }
  }

  return { importing, result, error, clear, importFile };
}
