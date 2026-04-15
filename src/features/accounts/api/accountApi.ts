import { apiFetch } from "../../../lib/api/client";
import type {
  CustomerAccount,
  AccountCreatePayload,
  AccountUpdatePayload,
  PaginatedAccounts,
  AccountsQueryParams,
} from "../types";
import {
  createDemoAccount,
  deleteDemoAccount,
  getDemoAccount,
  isDemoModeEnabled,
  listDemoAccounts,
  updateDemoAccount,
} from "../demoData";

function buildQS<T extends object>(p: T): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(p as Record<string, unknown>)) {
    if (v != null) qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function listAccounts(
  params: AccountsQueryParams = {}
): Promise<PaginatedAccounts> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoAccounts(params));
  }

  return apiFetch<PaginatedAccounts>(`/accounts${buildQS(params)}`).catch(() => listDemoAccounts(params));
}

export function getAccount(id: string): Promise<CustomerAccount> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(getDemoAccount(id));
  }

  return apiFetch<CustomerAccount>(`/accounts/${id}`).catch(() => getDemoAccount(id));
}

export function createAccount(
  payload: AccountCreatePayload
): Promise<{ message: string; data: CustomerAccount }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(createDemoAccount(payload));
  }

  return apiFetch<{ message: string; data: CustomerAccount }>("/accounts", { method: "POST", body: JSON.stringify(payload) }).catch(() => createDemoAccount(payload));
}

export function updateAccount(
  id: string,
  payload: AccountUpdatePayload
): Promise<{ message: string; data: CustomerAccount }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(updateDemoAccount(id, payload));
  }

  return apiFetch<{ message: string; data: CustomerAccount }>(`/accounts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }).catch(() => updateDemoAccount(id, payload));
}

export function deleteAccount(id: string): Promise<void> {
  if (isDemoModeEnabled()) {
    deleteDemoAccount(id);
    return Promise.resolve();
  }

  return apiFetch<void>(`/accounts/${id}`, { method: "DELETE" }).catch(() => {
    deleteDemoAccount(id);
  });
}
