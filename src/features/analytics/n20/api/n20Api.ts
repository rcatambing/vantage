import { apiFetch } from "../../../../lib/api/client";
import type { N20Data, N20Params } from "../types";

const BASE = "/analytics/metrics/N20";

export function fetchN20(params: N20Params): Promise<N20Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N20Data>(`${BASE}?${qs.toString()}`);
}
