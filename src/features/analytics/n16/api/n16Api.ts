import { apiFetch } from "../../../../lib/api/client";
import type { N16Data, N16Params } from "../types";

const BASE = "/analytics/metrics/N16";

export function fetchN16(params: N16Params): Promise<N16Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.period_days != null) qs.set("period_days", String(params.period_days));
  return apiFetch<N16Data>(`${BASE}?${qs.toString()}`);
}
