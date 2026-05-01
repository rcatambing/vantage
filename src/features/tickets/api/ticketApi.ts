import { apiFetch } from "../../../lib/api/client";
import type {
  Ticket,
  TicketSummary,
  TicketCreatePayload,
  TicketUpdatePayload,
  PaginatedTickets,
  TicketsQueryParams,
} from "../types";
import {
  isDemoModeEnabled,
  listDemoTickets,
  getDemoTicket,
  createDemoTicket,
  updateDemoTicket,
  deleteDemoTicket,
  addDemoRelationship,
  removeDemoRelationship,
} from "../demoData";

// ---------------------------------------------------------------------------
// Query-string builder
// ---------------------------------------------------------------------------

function buildQS(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  // BR-214: radius filter triple-completeness guard.
  const radiusFields = ["center_lat", "center_lng", "radius_km"] as const;
  const radiusProvided = radiusFields.filter((k) => params[k] != null);
  if (radiusProvided.length > 0 && radiusProvided.length < 3) {
    const missing = radiusFields.filter((k) => params[k] == null);
    throw new Error(
      `Radius filter requires all three params; missing: ${missing.join(", ")}`,
    );
  }

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null) qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

type PaginatedTicketsWire = Partial<PaginatedTickets> & {
  data?: TicketSummary[];
};

function normalizePaginatedTicketsResponse(
  res: PaginatedTicketsWire | null,
): PaginatedTickets {
  if (!res || typeof res !== "object" || Array.isArray(res)) {
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: 0,
    };
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
// Ticket CRUD
// ---------------------------------------------------------------------------

export function listTickets(
  params: TicketsQueryParams = {},
): Promise<PaginatedTickets> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoTickets(params));
  }
  return apiFetch<PaginatedTicketsWire>(
    `/tickets${buildQS(params as Record<string, string | number | boolean | undefined>)}`,
  )
    .then(normalizePaginatedTicketsResponse)
    .catch(() => listDemoTickets(params));
}

export function getTicket(id: string): Promise<Ticket> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(getDemoTicket(id));
  }
  return apiFetch<Ticket>(`/tickets/${id}`).catch(() => getDemoTicket(id));
}

export function createTicket(
  payload: TicketCreatePayload,
): Promise<{ message: string; data: TicketSummary }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(createDemoTicket(payload));
  }
  return apiFetch<{ message: string; data: TicketSummary }>("/tickets", {
    method: "POST",
    body: JSON.stringify(payload),
  }).catch(() => createDemoTicket(payload));
}

export function updateTicket(
  id: string,
  payload: TicketUpdatePayload,
): Promise<{ message: string; data: TicketSummary }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(updateDemoTicket(id, payload));
  }
  return apiFetch<{ message: string; data: TicketSummary }>(`/tickets/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }).catch(() => updateDemoTicket(id, payload));
}

export function deleteTicket(id: string): Promise<{ message: string }> {
  if (isDemoModeEnabled()) {
    deleteDemoTicket(id);
    return Promise.resolve({ message: "Ticket deleted" });
  }
  return apiFetch<{ message: string }>(`/tickets/${id}`, { method: "DELETE" }).catch(() => {
    deleteDemoTicket(id);
    return { message: "Ticket deleted" };
  });
}

// ---------------------------------------------------------------------------
// Relationships
// ---------------------------------------------------------------------------

export function addTicketRelationship(
  ticketId: string,
  payload: { kind: string; related_ticket_id: string },
): Promise<{ message: string }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(addDemoRelationship(ticketId, payload));
  }
  return apiFetch<{ message: string }>(`/tickets/${ticketId}/relationships`, {
    method: "POST",
    body: JSON.stringify(payload),
  }).catch(() => addDemoRelationship(ticketId, payload));
}

export function removeTicketRelationship(
  ticketId: string,
  relId: string,
): Promise<void> {
  if (isDemoModeEnabled()) {
    removeDemoRelationship(ticketId, relId);
    return Promise.resolve();
  }
  return apiFetch<void>(`/tickets/${ticketId}/relationships/${relId}`, {
    method: "DELETE",
  }).catch(() => {
    removeDemoRelationship(ticketId, relId);
  });
}
