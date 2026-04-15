import { apiFetch } from "../../../lib/api/client";
import type {
  Resource,
  ResourceAssignment,
  ResourceCreatePayload,
  ResourceUpdatePayload,
  ResourceAssignPayload,
  ResourceReassignPayload,
  ResourceUnassignPayload,
  ResourcesQueryParams,
  PaginatedResources,
} from "../types";
import { isDemoModeEnabled } from "../../accounts/demoData";
import {
  listDemoResources,
  getDemoResource,
  createDemoResource,
  updateDemoResource,
  deleteDemoResource,
  assignDemoResource,
  unassignDemoResource,
  reassignDemoResource,
  getDemoResourceHistory,
  listDemoOfficeResources,
} from "../demoData";

function buildQS<T extends object>(p: T): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(p as Record<string, unknown>)) {
    if (v != null) qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function listResources(params: ResourcesQueryParams = {}): Promise<PaginatedResources> {
  if (isDemoModeEnabled()) return Promise.resolve(listDemoResources(params));
  return apiFetch<PaginatedResources>(`/resources${buildQS(params)}`);
}

export function getResource(id: string): Promise<Resource> {
  if (isDemoModeEnabled()) return Promise.resolve(getDemoResource(id));
  return apiFetch<Resource>(`/resources/${id}`);
}

export function createResource(
  payload: ResourceCreatePayload
): Promise<{ message: string; data: Resource }> {
  if (isDemoModeEnabled()) return Promise.resolve(createDemoResource(payload));
  return apiFetch<{ message: string; data: Resource }>("/resources", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateResource(
  id: string,
  payload: ResourceUpdatePayload
): Promise<{ message: string; data: Resource }> {
  if (isDemoModeEnabled()) return Promise.resolve(updateDemoResource(id, payload));
  return apiFetch<{ message: string; data: Resource }>(`/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteResource(id: string): Promise<void> {
  if (isDemoModeEnabled()) { deleteDemoResource(id); return Promise.resolve(); }
  return apiFetch<void>(`/resources/${id}`, { method: "DELETE" });
}

// ─── Assignment ───────────────────────────────────────────────────────────────

export function assignResource(
  resourceId: string,
  payload: ResourceAssignPayload
): Promise<{ message: string; data: ResourceAssignment }> {
  if (isDemoModeEnabled()) return Promise.resolve(assignDemoResource(resourceId, payload));
  return apiFetch<{ message: string; data: ResourceAssignment }>(
    `/resources/${resourceId}/assign`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export function unassignResource(
  resourceId: string,
  payload: ResourceUnassignPayload = {}
): Promise<{ message: string; data: ResourceAssignment }> {
  if (isDemoModeEnabled()) return Promise.resolve(unassignDemoResource(resourceId, payload));
  return apiFetch<{ message: string; data: ResourceAssignment }>(
    `/resources/${resourceId}/unassign`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export function reassignResource(
  resourceId: string,
  payload: ResourceReassignPayload
): Promise<{ message: string; data: ResourceAssignment }> {
  if (isDemoModeEnabled()) return Promise.resolve(reassignDemoResource(resourceId, payload));
  return apiFetch<{ message: string; data: ResourceAssignment }>(
    `/resources/${resourceId}/reassign`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export function getResourceHistory(resourceId: string): Promise<ResourceAssignment[]> {
  if (isDemoModeEnabled()) return Promise.resolve(getDemoResourceHistory(resourceId));
  return apiFetch<ResourceAssignment[]>(`/resources/${resourceId}/history`);
}

// ─── Office Resources ─────────────────────────────────────────────────────────

export function listOfficeResources(officeId: string): Promise<Resource[]> {
  if (isDemoModeEnabled()) return Promise.resolve(listDemoOfficeResources(officeId));
  return apiFetch<Resource[]>(`/offices/${officeId}/resources`);
}
