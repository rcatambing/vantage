import { apiFetch } from "../../../../lib/api/client";
import type { N15Data, N15Params } from "../types";

const BASE = "/analytics/metrics/N15";

export function fetchN15(params: N15Params): Promise<N15Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N15Data>(`${BASE}?${qs.toString()}`);
}
