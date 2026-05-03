import { apiFetch } from "../../../../lib/api/client";
import type { M29Data, M29Params } from "../types";

const BASE = "/analytics/metrics/M29";

export function fetchM29(params: M29Params): Promise<M29Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M29Data>(`${BASE}?${qs.toString()}`);
}
