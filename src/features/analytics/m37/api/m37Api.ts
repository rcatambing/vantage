import { apiFetch } from "../../../../lib/api/client";
import type { M37Data, M37Params } from "../types";

const BASE = "/analytics/metrics/M37";

export function fetchM37(params: M37Params): Promise<M37Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M37Data>(`${BASE}?${qs.toString()}`);
}
