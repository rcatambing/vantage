import { apiFetch } from "../../../../lib/api/client";
import type { M13Data, M13Params } from "../types";

const BASE = "/analytics/metrics/M13";

export function fetchM13PhaseAdherence(params: M13Params): Promise<M13Data> {
  const qs = new URLSearchParams({ campaign_id: params.campaign_id });
  return apiFetch<M13Data>(`${BASE}?${qs.toString()}`);
}
