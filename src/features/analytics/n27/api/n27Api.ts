import { apiFetch } from "../../../../lib/api/client";
import type { N27Data, N27Params } from "../types";

const BASE = "/analytics/metrics/N27";

export function fetchN27(params: N27Params): Promise<N27Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.completeness_threshold != null) qs.set("completeness_threshold", String(params.completeness_threshold));
  return apiFetch<N27Data>(`${BASE}?${qs.toString()}`);
}
