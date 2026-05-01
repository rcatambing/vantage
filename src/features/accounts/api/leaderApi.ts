import { apiFetch } from "../../../lib/api/client";
import type {
  CommunityLeader,
  LeaderCreatePayload,
  LeaderUpdatePayload,
  PaginatedLeaders,
  LeadersQueryParams,
  LeaderEngagementEvent,
  AddEngagementPayload,
} from "../types";
import {
  addDemoEngagement,
  createDemoLeader,
  deleteDemoLeader,
  getDemoLeader,
  isDemoModeEnabled,
  listDemoEngagement,
  listDemoLeaders,
  updateDemoLeader,
} from "../demoData";

function buildQS<T extends object>(p: T): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(p as Record<string, unknown>)) {
    if (v != null) qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

type PaginatedLeadersWire = Partial<PaginatedLeaders> & {
  data?: CommunityLeader[];
};

function normalizePaginatedLeadersResponse(
  res: PaginatedLeadersWire | null
): PaginatedLeaders {
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

export function listLeaders(
  params: LeadersQueryParams = {}
): Promise<PaginatedLeaders> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoLeaders(params));
  }

  return apiFetch<PaginatedLeadersWire>(`/leaders${buildQS(params)}`)
    .then(normalizePaginatedLeadersResponse)
    .catch(() => listDemoLeaders(params));
}

export function getLeader(id: string): Promise<CommunityLeader> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(getDemoLeader(id));
  }

  return apiFetch<CommunityLeader>(`/leaders/${id}`).catch(() => getDemoLeader(id));
}

export function createLeader(
  payload: LeaderCreatePayload
): Promise<{ message: string; data: CommunityLeader }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(createDemoLeader(payload));
  }

  return apiFetch<{ message: string; data: CommunityLeader }>("/leaders", { method: "POST", body: JSON.stringify(payload) }).catch(() => createDemoLeader(payload));
}

export function updateLeader(
  id: string,
  payload: LeaderUpdatePayload
): Promise<{ message: string; data: CommunityLeader }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(updateDemoLeader(id, payload));
  }

  return apiFetch<{ message: string; data: CommunityLeader }>(`/leaders/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }).catch(() => updateDemoLeader(id, payload));
}

export function deleteLeader(id: string): Promise<void> {
  if (isDemoModeEnabled()) {
    deleteDemoLeader(id);
    return Promise.resolve();
  }

  return apiFetch<void>(`/leaders/${id}`, { method: "DELETE" }).catch(() => {
    deleteDemoLeader(id);
  });
}

export function getEngagement(
  leaderId: string
): Promise<LeaderEngagementEvent[]> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoEngagement(leaderId));
  }

  return apiFetch<LeaderEngagementEvent[]>(`/leaders/${leaderId}/engagement`).catch(() => listDemoEngagement(leaderId));
}

export function addEngagement(
  leaderId: string,
  payload: AddEngagementPayload
): Promise<{ message: string; data: LeaderEngagementEvent }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(addDemoEngagement(leaderId, payload));
  }

  return apiFetch<{ message: string; data: LeaderEngagementEvent }>(`/leaders/${leaderId}/engagement`, {
    method: "POST",
    body: JSON.stringify(payload),
  }).catch(() => addDemoEngagement(leaderId, payload));
}
