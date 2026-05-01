import { apiFetch } from "../../../lib/api/client";
import { normalizeListResponse, type ListResponseWire } from "../../../lib/api/responseShape";
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
  return apiFetch<ListResponseWire<AffiliationTypeRef>>("/affiliation-types").then(
    normalizeListResponse
  );
}

export function listAffiliations(params: { affiliation_type_id?: string } = {}): Promise<AffiliationRef[]> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoAffiliations(params.affiliation_type_id));
  }
  return apiFetch<ListResponseWire<AffiliationRef>>(`/affiliations${buildQS(params)}`).then(
    normalizeListResponse
  );
}

export function listSignalTypes(): Promise<SignalTypeRef[]> {
  if (isDemoModeEnabled()) {
    return Promise.resolve(listDemoSignalTypes());
  }
  return apiFetch<ListResponseWire<SignalTypeRef>>("/signal-types").then(
    normalizeListResponse
  );
}
