import { apiFetch } from "../../../../lib/api/client";
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
  const qs = new URLSearchParams({ campaign_id: params.campaign_id });
  if (params.district_id) qs.set("district_id", params.district_id);
  if (params.election_type) qs.set("election_type", params.election_type);
  if (params.election_cycle != null) qs.set("election_cycle", String(params.election_cycle));
  return apiFetch<M07EstimateResponse>(`${BASE}?${qs.toString()}`);
}

export function fetchM07History(params: M07HistoryParams): Promise<M07HistoryResponse> {
  const qs = new URLSearchParams({ campaign_id: params.campaign_id });
  if (params.district_id) qs.set("district_id", params.district_id);
  if (params.election_type) qs.set("election_type", params.election_type);
  if (params.year_from != null) qs.set("year_from", String(params.year_from));
  if (params.year_to != null) qs.set("year_to", String(params.year_to));
  qs.set("page", String(params.page ?? 1));
  qs.set("page_size", String(params.page_size ?? 25));
  return apiFetch<M07HistoryResponse>(`${BASE}/history?${qs.toString()}`);
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
