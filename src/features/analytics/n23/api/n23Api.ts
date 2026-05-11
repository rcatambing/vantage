import { apiFetch } from "../../../../lib/api/client";
import type { N23Data, N23Params } from "../types";

const BASE = "/analytics/metrics/N23";

export function fetchN23(params: N23Params): Promise<N23Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N23Data>(`${BASE}?${qs.toString()}`);
}
