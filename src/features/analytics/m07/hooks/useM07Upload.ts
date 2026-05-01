import { useState, useRef, useCallback } from "react";
import { uploadM07File, fetchM07UploadBatch } from "../api/m07Api";
import type { M07UploadAccepted, M07UploadBatch, DuplicateMode } from "../types";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface UploadWizardState {
  step: WizardStep;
  file: File | null;
  /** CSV column headers parsed from the first line of the file (empty for XLSX). */
  csvHeaders: string[];
  duplicateMode: DuplicateMode;
  idempotencyKey: string;
  /** Result from the VALIDATE_ONLY pass. Populated when step >= 3. */
  validateResult: M07UploadAccepted | null;
  /** Polled batch state during and after the COMMIT pass. */
  batchStatus: M07UploadBatch | null;
  error: string | null;
  loading: boolean;
}

function generateKey(): string {
  return `m07-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseCsvHeaders(file: File): Promise<string[]> {
  return new Promise((resolve) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      resolve([]);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) ?? "";
      const firstLine = text.split(/\r?\n/)[0] ?? "";
      resolve(firstLine.split(",").map((h) => h.trim().replace(/^"|"$/g, "")));
    };
    reader.onerror = () => resolve([]);
    // Only read first 4 KB — enough for a header row
    reader.readAsText(file.slice(0, 4096));
  });
}

const POLL_INTERVAL_MS = 2000;
const TERMINAL_STATUSES = new Set(["COMMITTED", "FAILED", "CANCELLED"]);

export function useM07Upload(campaignId: string) {
  const [state, setState] = useState<UploadWizardState>({
    step: 1,
    file: null,
    csvHeaders: [],
    duplicateMode: "REJECT",
    idempotencyKey: generateKey(),
    validateResult: null,
    batchStatus: null,
    error: null,
    loading: false,
  });

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  /** Step 1 → 2: user selected a file and duplicate mode. */
  const selectFile = useCallback(
    async (file: File, duplicateMode: DuplicateMode) => {
      const csvHeaders = await parseCsvHeaders(file);
      setState((s) => ({
        ...s,
        file,
        csvHeaders,
        duplicateMode,
        idempotencyKey: generateKey(),
        error: null,
        validateResult: null,
        batchStatus: null,
        step: 2,
      }));
    },
    []
  );

  /**
   * Step 2 → 3: user confirmed column mapping.
   * Fires VALIDATE_ONLY and lands on the preview step once the result arrives.
   */
  const confirmMapping = useCallback(async () => {
    const { file, idempotencyKey, duplicateMode } = state;
    if (!file) return;
    setState((s) => ({ ...s, step: 3, loading: true, error: null }));
    try {
      const result = await uploadM07File({
        campaign_id: campaignId,
        file,
        idempotency_key: idempotencyKey,
        duplicate_mode: duplicateMode,
        commit_mode: "VALIDATE_ONLY",
      });
      setState((s) => ({ ...s, loading: false, validateResult: result }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Validation failed",
      }));
    }
  }, [campaignId, state.file, state.idempotencyKey, state.duplicateMode]);

  /**
   * Step 3 → 4 → 5: user clicked Import.
   * Fires COMMIT with a fresh idempotency key, then polls until terminal.
   */
  const runCommit = useCallback(async () => {
    const { file, idempotencyKey, duplicateMode } = state;
    if (!file) return;
    // Use a distinct key for the commit pass so idempotency cache is separate
    const commitKey = `${idempotencyKey}-c`;
    setState((s) => ({ ...s, step: 4, loading: true, error: null }));
    try {
      const result = await uploadM07File({
        campaign_id: campaignId,
        file,
        idempotency_key: commitKey,
        duplicate_mode: duplicateMode,
        commit_mode: "COMMIT",
      });

      const batchId = result.batch_id;
      pollRef.current = setInterval(async () => {
        try {
          const batch = await fetchM07UploadBatch(batchId);
          if (TERMINAL_STATUSES.has(batch.status)) {
            stopPolling();
            setState((s) => ({ ...s, loading: false, batchStatus: batch, step: 5 }));
          } else {
            setState((s) => ({ ...s, batchStatus: batch }));
          }
        } catch {
          stopPolling();
          setState((s) => ({ ...s, loading: false, step: 5 }));
        }
      }, POLL_INTERVAL_MS);
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Import failed",
      }));
    }
  }, [campaignId, state.file, state.idempotencyKey, state.duplicateMode, stopPolling]);

  /** Navigate back one step (only valid from steps 2 and 3). */
  const goBack = useCallback(() => {
    setState((s) => {
      if (s.step === 2) return { ...s, step: 1, error: null };
      if (s.step === 3) return { ...s, step: 2, error: null };
      return s;
    });
  }, []);

  /** Reset wizard to initial state (also clears any active poll). */
  const reset = useCallback(() => {
    stopPolling();
    setState({
      step: 1,
      file: null,
      csvHeaders: [],
      duplicateMode: "REJECT",
      idempotencyKey: generateKey(),
      validateResult: null,
      batchStatus: null,
      error: null,
      loading: false,
    });
  }, [stopPolling]);

  return { state, selectFile, confirmMapping, runCommit, goBack, reset };
}
