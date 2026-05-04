import { apiFetch } from "../../../lib/api/client";
import type {
  Anecdote,
  AnecdoteFilters,
  AnecdoteCreatePayload,
  AnecdoteUpdatePayload,
  CanvassSubmitPayload,
  PaginatedAnecdotes,
  OfflineQueueItem,
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

type PaginatedAnecdotesWire = Partial<PaginatedAnecdotes> & {
  data?: Anecdote[];
};

function normalizePaginatedAnecdotesResponse(
  res: PaginatedAnecdotesWire | null,
): PaginatedAnecdotes {
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
// Anecdote CRUD
// ---------------------------------------------------------------------------

export function getAnecdotes(
  campaignId: string,
  filters: AnecdoteFilters = {},
): Promise<PaginatedAnecdotes> {
  return apiFetch<PaginatedAnecdotesWire>(
    `/anecdotes${buildQS({ ...filters, campaign_id: campaignId })}`,
  ).then(normalizePaginatedAnecdotesResponse);
}

export function getAnecdote(id: string): Promise<Anecdote> {
  return apiFetch<Anecdote>(`/anecdotes/${id}`);
}

export function createAnecdote(
  payload: AnecdoteCreatePayload,
): Promise<{ message: string; data: Anecdote }> {
  return apiFetch<{ message: string; data: Anecdote }>("/anecdotes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAnecdote(
  id: string,
  payload: AnecdoteUpdatePayload,
): Promise<{ message: string; data: Anecdote }> {
  return apiFetch<{ message: string; data: Anecdote }>(`/anecdotes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAnecdote(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/anecdotes/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Canvass & Sync
// ---------------------------------------------------------------------------

export function submitCanvass(
  payload: CanvassSubmitPayload,
): Promise<{ message: string; data: CanvassSubmitPayload }> {
  return apiFetch<{ message: string; data: CanvassSubmitPayload }>("/anecdotes/canvass", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function syncOfflineQueue(
  queue: OfflineQueueItem[],
): Promise<{ message: string; synced: number; failed: number }> {
  return apiFetch<{ message: string; synced: number; failed: number }>("/anecdotes/sync", {
    method: "POST",
    body: JSON.stringify({ items: queue }),
  });
}
