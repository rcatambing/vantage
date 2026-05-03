import { apiFetch } from "../../../../lib/api/client";
import type { N17Data, N17Params } from "../types";

const BASE = "/analytics/metrics/N17";

export function fetchN17(params: N17Params): Promise<N17Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.period_days != null) qs.set("period_days", String(params.period_days));
  return apiFetch<N17Data>(`${BASE}?${qs.toString()}`);
}
