import { apiFetch } from "../../../../lib/api/client";
import { buildQueryString } from "../../../../lib/api/queryString";
import type {
  M07EstimateResponse,
  M07EstimateParams,
  M07HistoryResponse,
  M07HistoryParams,
  M07UploadAccepted,
  M07UploadBatch,
  M07UploadFileParams,
} from "../types";

const BASE = "/analytics/metrics/M07";

export function fetchM07Estimate(params: M07EstimateParams): Promise<M07EstimateResponse> {
  return apiFetch<M07EstimateResponse>(`${BASE}${buildQueryString(params)}`);
}

export function fetchM07History(params: M07HistoryParams): Promise<M07HistoryResponse> {
  return apiFetch<M07HistoryResponse>(`${BASE}/history${buildQueryString(params)}`);
}

/**
 * Uploads a CSV/XLSX file for historical turnout ingestion.
 * Uses raw fetch (not apiFetch) to avoid setting Content-Type — the browser
 * sets the correct multipart/form-data boundary automatically.
 * TODO: Add Authorization header here once JWT auth is wired (see lib/api/client.ts).
 */
export async function uploadM07File(params: M07UploadFileParams): Promise<M07UploadAccepted> {
  const formData = new FormData();
  formData.append("campaign_id", params.campaign_id);
  formData.append("file", params.file);
  formData.append("idempotency_key", params.idempotency_key);
  formData.append("duplicate_mode", params.duplicate_mode);
  formData.append("commit_mode", params.commit_mode);

  const res = await fetch(`/api${BASE}/uploads`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      (body as { detail?: string; title?: string } | null)?.detail ??
        (body as { detail?: string; title?: string } | null)?.title ??
        `API error ${res.status}`
    );
  }
  return res.json() as Promise<M07UploadAccepted>;
}

export function fetchM07UploadBatch(batchId: string): Promise<M07UploadBatch> {
  return apiFetch<M07UploadBatch>(`${BASE}/uploads/${batchId}`);
}

/** Returns the URL for the row-level error report CSV download. */
export function getM07ErrorReportUrl(batchId: string): string {
  return `/api${BASE}/uploads/${batchId}/errors`;
}
