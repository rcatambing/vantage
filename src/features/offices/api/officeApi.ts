import { apiFetch } from "../../../lib/api/client";
import type {
  Office,
  OfficeContact,
  CampaignOfficeLink,
  OfficeStaffAssignment,
  OfficeCreatePayload,
  OfficeUpdatePayload,
  ContactCreatePayload,
  ContactUpdatePayload,
  CampaignOfficeLinkPayload,
  StaffAssignPayload,
  StaffRoleUpdatePayload,
  OfficesQueryParams,
  PaginatedOffices,
} from "../types";
import {
  isDemoModeEnabled,
  listDemoOffices,
  getDemoOffice,
  createDemoOffice,
  updateDemoOffice,
  deleteDemoOffice,
  listDemoOfficeContacts,
  createDemoOfficeContact,
  updateDemoOfficeContact,
  deleteDemoOfficeContact,
  setDemoPrimaryContact,
  listDemoOfficeCampaigns,
  linkDemoOfficeToCampaign,
  unlinkDemoOfficeFromCampaign,
  listDemoOfficeStaff,
  assignDemoStaff,
  updateDemoStaffRole,
  removeDemoStaff,
} from "../demoData";

function buildQS<T extends object>(p: T): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(p as Record<string, unknown>)) {
    if (v != null) qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function listOffices(params: OfficesQueryParams = {}): Promise<PaginatedOffices> {
  if (isDemoModeEnabled()) return Promise.resolve(listDemoOffices(params));
  return apiFetch<PaginatedOffices>(`/offices${buildQS(params)}`);
}

export function getOffice(id: string): Promise<Office> {
  if (isDemoModeEnabled()) return Promise.resolve(getDemoOffice(id));
  return apiFetch<Office>(`/offices/${id}`);
}

export function createOffice(
  payload: OfficeCreatePayload
): Promise<{ message: string; data: Office }> {
  if (isDemoModeEnabled()) return Promise.resolve(createDemoOffice(payload));
  return apiFetch<{ message: string; data: Office }>("/offices", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateOffice(
  id: string,
  payload: OfficeUpdatePayload
): Promise<{ message: string; data: Office }> {
  if (isDemoModeEnabled()) return Promise.resolve(updateDemoOffice(id, payload));
  return apiFetch<{ message: string; data: Office }>(`/offices/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteOffice(id: string): Promise<void> {
  if (isDemoModeEnabled()) { deleteDemoOffice(id); return Promise.resolve(); }
  return apiFetch<void>(`/offices/${id}`, { method: "DELETE" });
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export function listOfficeContacts(officeId: string): Promise<OfficeContact[]> {
  if (isDemoModeEnabled()) return Promise.resolve(listDemoOfficeContacts(officeId));
  return apiFetch<OfficeContact[]>(`/offices/${officeId}/contacts`);
}

export function createOfficeContact(
  officeId: string,
  payload: ContactCreatePayload
): Promise<{ message: string; data: OfficeContact }> {
  if (isDemoModeEnabled()) return Promise.resolve(createDemoOfficeContact(officeId, payload));
  return apiFetch<{ message: string; data: OfficeContact }>(
    `/offices/${officeId}/contacts`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export function updateOfficeContact(
  officeId: string,
  contactId: string,
  payload: ContactUpdatePayload
): Promise<{ message: string; data: OfficeContact }> {
  if (isDemoModeEnabled()) return Promise.resolve(updateDemoOfficeContact(officeId, contactId, payload));
  return apiFetch<{ message: string; data: OfficeContact }>(
    `/offices/${officeId}/contacts/${contactId}`,
    { method: "PUT", body: JSON.stringify(payload) }
  );
}

export function deleteOfficeContact(
  officeId: string,
  contactId: string
): Promise<void> {
  if (isDemoModeEnabled()) { deleteDemoOfficeContact(officeId, contactId); return Promise.resolve(); }
  return apiFetch<void>(`/offices/${officeId}/contacts/${contactId}`, {
    method: "DELETE",
  });
}

export function setPrimaryContact(
  officeId: string,
  contactId: string
): Promise<OfficeContact> {
  if (isDemoModeEnabled()) return Promise.resolve(setDemoPrimaryContact(officeId, contactId));
  return apiFetch<OfficeContact>(
    `/offices/${officeId}/contacts/${contactId}/primary`,
    { method: "PUT" }
  );
}

// ─── Campaign Links ──────────────────────────────────────────────────────────

export function listOfficeCampaigns(officeId: string): Promise<CampaignOfficeLink[]> {
  if (isDemoModeEnabled()) return Promise.resolve(listDemoOfficeCampaigns(officeId));
  return apiFetch<CampaignOfficeLink[]>(`/offices/${officeId}/campaigns`);
}

export function linkOfficeToCampaign(
  officeId: string,
  payload: CampaignOfficeLinkPayload
): Promise<{ message: string; data: CampaignOfficeLink }> {
  if (isDemoModeEnabled()) return Promise.resolve(linkDemoOfficeToCampaign(officeId, payload));
  return apiFetch<{ message: string; data: CampaignOfficeLink }>(
    `/offices/${officeId}/campaigns`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export function unlinkOfficeFromCampaign(
  officeId: string,
  campaignId: string
): Promise<void> {
  if (isDemoModeEnabled()) { unlinkDemoOfficeFromCampaign(officeId, campaignId); return Promise.resolve(); }
  return apiFetch<void>(`/offices/${officeId}/campaigns/${campaignId}`, {
    method: "DELETE",
  });
}

// ─── Staff ───────────────────────────────────────────────────────────────────

export function listOfficeStaff(officeId: string): Promise<OfficeStaffAssignment[]> {
  if (isDemoModeEnabled()) return Promise.resolve(listDemoOfficeStaff(officeId));
  return apiFetch<OfficeStaffAssignment[]>(`/offices/${officeId}/staff`);
}

export function assignStaff(
  officeId: string,
  payload: StaffAssignPayload
): Promise<{ message: string; data: OfficeStaffAssignment }> {
  if (isDemoModeEnabled()) return Promise.resolve(assignDemoStaff(officeId, payload));
  return apiFetch<{ message: string; data: OfficeStaffAssignment }>(
    `/offices/${officeId}/staff`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export function updateStaffRole(
  officeId: string,
  userId: string,
  payload: StaffRoleUpdatePayload
): Promise<{ message: string; data: OfficeStaffAssignment }> {
  if (isDemoModeEnabled()) return Promise.resolve(updateDemoStaffRole(officeId, userId, payload));
  return apiFetch<{ message: string; data: OfficeStaffAssignment }>(
    `/offices/${officeId}/staff/${userId}`,
    { method: "PUT", body: JSON.stringify(payload) }
  );
}

export function removeStaff(officeId: string, userId: string): Promise<void> {
  if (isDemoModeEnabled()) { removeDemoStaff(officeId, userId); return Promise.resolve(); }
  return apiFetch<void>(`/offices/${officeId}/staff/${userId}`, {
    method: "DELETE",
  });
}
