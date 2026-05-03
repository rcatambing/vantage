import { apiFetch } from "../../../../lib/api/client";
import type { M19Data, M19Params } from "../types";

const BASE = "/analytics/metrics/M19";

export function fetchM19(params: M19Params): Promise<M19Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M19Data>(`${BASE}?${qs.toString()}`);
}
