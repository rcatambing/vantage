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

type PaginatedAccountsWire = Partial<PaginatedAccounts> & {
  data?: CustomerAccount[];
};

function normalizePaginatedAccountsResponse(
  res: PaginatedAccountsWire | null
): PaginatedAccounts {
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

export function listAccounts(
  params: AccountsQueryParams = {}
): Promise<PaginatedAccounts> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoAccounts(params));
  }

  return apiFetch<PaginatedAccountsWire>(`/accounts${buildQS(params)}`)
    .then(normalizePaginatedAccountsResponse)
    .catch(() => listDemoAccounts(params));
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
