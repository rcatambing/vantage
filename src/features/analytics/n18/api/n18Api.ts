import { apiFetch } from "../../../../lib/api/client";
import type { N18Data, N18Params } from "../types";

const BASE = "/analytics/metrics/N18";

export function fetchN18(params: N18Params): Promise<N18Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.period_days != null) qs.set("period_days", String(params.period_days));
  return apiFetch<N18Data>(`${BASE}?${qs.toString()}`);
}
