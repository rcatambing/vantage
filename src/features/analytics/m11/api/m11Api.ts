import { apiFetch } from "../../../../lib/api/client";
import type { M11Data, M11Params } from "../types";

const BASE = "/analytics/metrics/M11";

export function fetchM11TaskOverdue(params: M11Params): Promise<M11Data> {
  const qs = new URLSearchParams({ campaign_id: params.campaign_id });
  if (params.objective_id) qs.set("objective_id", params.objective_id);
  return apiFetch<M11Data>(`${BASE}?${qs.toString()}`);
}
