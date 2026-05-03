import { apiFetch } from "../../../../lib/api/client";
import type { N35Data, N35Params } from "../types";

const BASE = "/analytics/metrics/N35";

export function fetchN35(params: N35Params): Promise<N35Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.period_days != null) qs.set("period_days", String(params.period_days));
  return apiFetch<N35Data>(`${BASE}?${qs.toString()}`);
}
