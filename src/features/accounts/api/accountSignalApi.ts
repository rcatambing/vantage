import { apiFetch } from "../../../lib/api/client";
import type {
  AccountSignal,
  AccountSignalCreatePayload,
  PaginatedAccountSignals,
  AccountSignalUpdatePayload,
} from "../types";
import {
  createDemoAccountSignal,
  deleteDemoAccountSignal,
  isDemoModeEnabled,
  listDemoAccountSignals,
  updateDemoAccountSignal,
} from "../demoData";

function buildQS(p: Record<string, string | number | boolean | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    if (v != null) qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function listAccountSignals(
  accountId: string,
  params: { signal_type_code?: string; active_only?: boolean; page?: number; page_size?: number } = {}
): Promise<PaginatedAccountSignals> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoAccountSignals(accountId, params));
  }
  return apiFetch<PaginatedAccountSignals>(
    `/accounts/${accountId}/signals${buildQS(params)}`
  );
}

export function createAccountSignal(
  accountId: string,
  payload: AccountSignalCreatePayload
): Promise<{ message: string; data: AccountSignal }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(createDemoAccountSignal(accountId, payload));
  }
  return apiFetch<{ message: string; data: AccountSignal }>(
    `/accounts/${accountId}/signals`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export function updateAccountSignal(
  accountId: string,
  signalId: string,
  payload: AccountSignalUpdatePayload
): Promise<{ message: string; data: AccountSignal }> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(updateDemoAccountSignal(accountId, signalId, payload));
  }
  return apiFetch<{ message: string; data: AccountSignal }>(
    `/accounts/${accountId}/signals/${signalId}`,
    { method: "PUT", body: JSON.stringify(payload) }
  );
}

export function deleteAccountSignal(accountId: string, signalId: string): Promise<void> {
  if (isDemoModeEnabled()) {
    deleteDemoAccountSignal(accountId, signalId);
    return Promise.resolve();
  }
  return apiFetch<void>(`/accounts/${accountId}/signals/${signalId}`, {
    method: "DELETE",
  });
}
