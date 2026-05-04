import { useState, useEffect, useRef, useCallback } from "react";
import {
  getPolls,
  getPoll,
  createPoll,
  updatePoll,
  deletePoll,
  startPoll,
  holdPoll,
  completePoll,
  cancelPoll,
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getParticipants,
  importParticipants,
  getResponseAggregates,
} from "../api/pollApi";
import type {
  Poll,
  PollQuestion,
  Participant,
  PollCreatePayload,
  PollUpdatePayload,
  QuestionCreatePayload,
  QuestionUpdatePayload,
  ParticipantImportResult,
  PollResponseAggregate,
} from "../types";

// ---------------------------------------------------------------------------
// usePollList
// ---------------------------------------------------------------------------

export function usePollList(campaignId: string | undefined) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPolls = useCallback(async () => {
    if (!campaignId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getPolls(campaignId);
      setPolls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load polls");
      setPolls([]);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  return { polls, loading, error, refetch: loadPolls };
}

// ---------------------------------------------------------------------------
// usePoll
// ---------------------------------------------------------------------------

export interface UsePollResult {
  poll: Poll | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePoll(pollId: string | undefined): UsePollResult {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!pollId) {
      setLoading(false);
      return;
    }
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    setLoading(true);
    setError(null);
    getPoll(pollId)
      .then((value) => {
        if (requestIdRef.current === requestId) setPoll(value);
      })
      .catch((e: unknown) => {
        if (requestIdRef.current === requestId) {
          setError(e instanceof Error ? e.message : "Failed to load poll.");
        }
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoading(false);
      });
  }, [pollId, fetchCount]);

  function refetch() {
    setFetchCount((n) => n + 1);
  }

  return { poll, loading, error, refetch };
}

// ---------------------------------------------------------------------------
// usePollMutations
// ---------------------------------------------------------------------------

export interface UsePollMutationsOptions {
  onSuccess?: () => void;
}

export interface UsePollMutationsResult {
  submitting: boolean;
  error: string | null;
  clearErrors: () => void;
  create: (payload: PollCreatePayload) => Promise<boolean>;
  update: (id: string, payload: PollUpdatePayload) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
}

export function usePollMutations(
  options: UsePollMutationsOptions = {},
): UsePollMutationsResult {
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

  async function create(payload: PollCreatePayload): Promise<boolean> {
    return withMutationLifecycle(() => createPoll(payload).then(() => void 0));
  }

  async function update(id: string, payload: PollUpdatePayload): Promise<boolean> {
    return withMutationLifecycle(() => updatePoll(id, payload).then(() => void 0));
  }

  async function remove(id: string): Promise<boolean> {
    return withMutationLifecycle(() => deletePoll(id).then(() => void 0));
  }

  return { submitting, error, clearErrors, create, update, remove };
}

// ---------------------------------------------------------------------------
// usePollLifecycle
// ---------------------------------------------------------------------------

export interface UsePollLifecycleResult {
  transitioning: boolean;
  error: string | null;
  clearErrors: () => void;
  start: (id: string) => Promise<boolean>;
  hold: (id: string) => Promise<boolean>;
  complete: (id: string) => Promise<boolean>;
  cancel: (id: string) => Promise<boolean>;
}

export function usePollLifecycle(
  options: UsePollMutationsOptions = {},
): UsePollLifecycleResult {
  const { onSuccess } = options;
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearErrors() {
    setError(null);
  }

  async function withLifecycle(fn: () => Promise<void>): Promise<boolean> {
    if (transitioning) return false;
    setTransitioning(true);
    clearErrors();
    try {
      await fn();
      onSuccess?.();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Action failed.");
      return false;
    } finally {
      setTransitioning(false);
    }
  }

  return {
    transitioning,
    error,
    clearErrors,
    start: (id) => withLifecycle(() => startPoll(id).then(() => void 0)),
    hold: (id) => withLifecycle(() => holdPoll(id).then(() => void 0)),
    complete: (id) => withLifecycle(() => completePoll(id).then(() => void 0)),
    cancel: (id) => withLifecycle(() => cancelPoll(id).then(() => void 0)),
  };
}

// ---------------------------------------------------------------------------
// useQuestionMutations
// ---------------------------------------------------------------------------

export interface UseQuestionMutationsResult {
  submitting: boolean;
  error: string | null;
  clearErrors: () => void;
  add: (pollId: string, payload: QuestionCreatePayload) => Promise<boolean>;
  update: (pollId: string, questionId: string, payload: QuestionUpdatePayload) => Promise<boolean>;
  remove: (pollId: string, questionId: string) => Promise<boolean>;
}

export function useQuestionMutations(
  options: UsePollMutationsOptions = {},
): UseQuestionMutationsResult {
  const { onSuccess } = options;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearErrors() {
    setError(null);
  }

  async function withMutation(fn: () => Promise<void>): Promise<boolean> {
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

  return {
    submitting,
    error,
    clearErrors,
    add: (pollId, payload) =>
      withMutation(() => addQuestion(pollId, payload).then(() => void 0)),
    update: (pollId, questionId, payload) =>
      withMutation(() => updateQuestion(pollId, questionId, payload).then(() => void 0)),
    remove: (pollId, questionId) =>
      withMutation(() => deleteQuestion(pollId, questionId).then(() => void 0)),
  };
}

// ---------------------------------------------------------------------------
// useParticipantMutations
// ---------------------------------------------------------------------------

export interface UseParticipantMutationsResult {
  importing: boolean;
  error: string | null;
  clearErrors: () => void;
  importFile: (pollId: string, file: File) => Promise<ParticipantImportResult | null>;
}

export function useParticipantMutations(): UseParticipantMutationsResult {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearErrors() {
    setError(null);
  }

  async function importFile(
    pollId: string,
    file: File,
  ): Promise<ParticipantImportResult | null> {
    setImporting(true);
    clearErrors();
    try {
      const result = await importParticipants(pollId, file);
      return result;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Import failed.");
      return null;
    } finally {
      setImporting(false);
    }
  }

  return { importing, error, clearErrors, importFile };
}

// ---------------------------------------------------------------------------
// useQuestions
// ---------------------------------------------------------------------------

export function useQuestions(pollId: string | undefined) {
  const [questions, setQuestions] = useState<PollQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!pollId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getQuestions(pollId);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    load();
  }, [load]);

  return { questions, loading, error, refetch: load };
}

// ---------------------------------------------------------------------------
// useParticipants
// ---------------------------------------------------------------------------

export function useParticipants(pollId: string | undefined) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!pollId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getParticipants(pollId);
      setParticipants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load participants");
    } finally {
      setLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    load();
  }, [load]);

  return { participants, loading, error, refetch: load };
}

// ---------------------------------------------------------------------------
// useResponseAggregates
// ---------------------------------------------------------------------------

export function useResponseAggregates(pollId: string | undefined) {
  const [aggregates, setAggregates] = useState<PollResponseAggregate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!pollId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getResponseAggregates(pollId);
      setAggregates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load responses");
    } finally {
      setLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    load();
  }, [load]);

  return { aggregates, loading, error, refetch: load };
}
