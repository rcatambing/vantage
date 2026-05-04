import { apiFetch } from "../../../lib/api/client";
import { normalizeListResponse, type ListResponseWire } from "../../../lib/api/responseShape";
import type {
  Voter,
  VoterCreatePayload,
  VoterUpdatePayload,
  VoterFilters,
  PaginatedVoters,
  VoterImportResult,
} from "../types";

// ---------------------------------------------------------------------------
// Query-string builder
// ---------------------------------------------------------------------------

function buildQS(
  params: Record<string, string | number | boolean | undefined | null | string[]>,
): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      v.forEach((item) => qs.append(k, String(item)));
    } else {
      qs.set(k, String(v));
    }
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

type PaginatedVotersWire = Partial<PaginatedVoters> & {
  data?: Voter[];
};

function normalizePaginatedVotersResponse(
  res: PaginatedVotersWire | null,
): PaginatedVoters {
  if (!res || typeof res !== "object" || Array.isArray(res)) {
    return { items: [], total: 0, page: 1, page_size: 0 };
  }
  const parsedTotal = Number(res.total);
  const parsedPage = Number(res.page);
  const parsedPageSize = Number(res.page_size);
  return {
    items: Array.isArray(res.items)
      ? res.items
      : Array.isArray(res.data)
        ? res.data
        : [],
    total: Number.isFinite(parsedTotal) ? parsedTotal : 0,
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    page_size: Number.isFinite(parsedPageSize) ? parsedPageSize : 0,
  };
}

// ---------------------------------------------------------------------------
// Voter CRUD
// ---------------------------------------------------------------------------

export function getVoters(params: VoterFilters = {}): Promise<PaginatedVoters> {
  return apiFetch<PaginatedVotersWire>(
    `/voters${buildQS(params as Record<string, string | number | boolean | undefined>)}`,
  ).then(normalizePaginatedVotersResponse);
}

export function getVoter(id: string): Promise<Voter> {
  return apiFetch<Voter>(`/voters/${id}`);
}

export function createVoter(
  payload: VoterCreatePayload,
): Promise<{ message: string; data: Voter }> {
  return apiFetch<{ message: string; data: Voter }>("/voters", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateVoter(
  id: string,
  payload: VoterUpdatePayload,
): Promise<{ message: string; data: Voter }> {
  return apiFetch<{ message: string; data: Voter }>(`/voters/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteVoter(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/voters/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Import & Search
// ---------------------------------------------------------------------------

export function importVoters(file: File, campaignId: string): Promise<VoterImportResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("campaign_id", campaignId);
  return apiFetch<VoterImportResult>("/voters/import", {
    method: "POST",
    body: formData,
    headers: {}, // Let browser set multipart boundary
  });
}

export function searchVoters(q: string, campaignId: string): Promise<Voter[]> {
  return apiFetch<ListResponseWire<Voter>>(
    `/voters/search${buildQS({ q, campaign_id: campaignId })}`,
  ).then(normalizeListResponse);
}
