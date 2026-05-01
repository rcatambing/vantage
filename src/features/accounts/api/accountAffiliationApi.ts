import { apiFetch } from "../../../lib/api/client";
import { normalizeListResponse, type ListResponseWire } from "../../../lib/api/responseShape";
import type {
  AccountAffiliation,
  AccountAffiliationCreatePayload,
  AccountAffiliationUpdatePayload,
} from "../types";
import {
  createDemoAccountAffiliation,
  deleteDemoAccountAffiliation,
  isDemoModeEnabled,
  listDemoAccountAffiliations,
  updateDemoAccountAffiliation,
} from "../demoData";

function buildQS(p: Record<string, string | boolean | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    if (v != null) qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function listAccountAffiliations(
  accountId: string,
  params: { affiliation_type_code?: string; active_only?: boolean } = {}
): Promise<AccountAffiliation[]> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoAccountAffiliations(accountId, params));
  }
  return apiFetch<ListResponseWire<AccountAffiliation>>(
    `/accounts/${accountId}/affiliations${buildQS(params)}`
  ).then(normalizeListResponse);
}

export function createAccountAffiliation(
  accountId: string,
  payload: AccountAffiliationCreatePayload
): Promise<{ message: string; data: AccountAffiliation }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(createDemoAccountAffiliation(accountId, payload));
  }
  return apiFetch<{ message: string; data: AccountAffiliation }>(
    `/accounts/${accountId}/affiliations`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export function updateAccountAffiliation(
  accountId: string,
  id: string,
  payload: AccountAffiliationUpdatePayload
): Promise<{ message: string; data: AccountAffiliation }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(updateDemoAccountAffiliation(accountId, id, payload));
  }
  return apiFetch<{ message: string; data: AccountAffiliation }>(
    `/accounts/${accountId}/affiliations/${id}`,
    { method: "PUT", body: JSON.stringify(payload) }
  );
}

export function deleteAccountAffiliation(accountId: string, id: string): Promise<void> {
  if (isDemoModeEnabled()) {
    deleteDemoAccountAffiliation(accountId, id);
    return Promise.resolve();
  }
  return apiFetch<void>(`/accounts/${accountId}/affiliations/${id}`, {
    method: "DELETE",
  });
}
