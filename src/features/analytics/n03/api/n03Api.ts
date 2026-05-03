import { apiFetch } from "../../../../lib/api/client";
import type { N03Data, N03Params } from "../types";

const BASE = "/analytics/metrics/N03";

export function fetchN03(params: N03Params): Promise<N03Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.days_threshold != null) qs.set("days_threshold", String(params.days_threshold));
  return apiFetch<N03Data>(`${BASE}?${qs.toString()}`);
}
