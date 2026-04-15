import { apiFetch } from "../../../lib/api/client";
import type { AffiliationRef, AffiliationTypeRef, SignalTypeRef } from "../types";
import {
  isDemoModeEnabled,
  listDemoAffiliations,
  listDemoAffiliationTypes,
  listDemoSignalTypes,
} from "../demoData";

function buildQS(p: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    if (v != null && v !== "") qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function listAffiliationTypes(): Promise<AffiliationTypeRef[]> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoAffiliationTypes());
  }
  return apiFetch<AffiliationTypeRef[]>("/affiliation-types");
}

export function listAffiliations(params: { affiliation_type_id?: string } = {}): Promise<AffiliationRef[]> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoAffiliations(params.affiliation_type_id));
  }
  return apiFetch<AffiliationRef[]>(`/affiliations${buildQS(params)}`);
}

export function listSignalTypes(): Promise<SignalTypeRef[]> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoSignalTypes());
  }
  return apiFetch<SignalTypeRef[]>("/signal-types");
}
