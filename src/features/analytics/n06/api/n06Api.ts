import { apiFetch } from "../../../../lib/api/client";
import type { N06Data, N06Params } from "../types";

const BASE = "/analytics/metrics/N06";

export function fetchN06(params: N06Params): Promise<N06Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<N06Data>(`${BASE}?${qs.toString()}`);
}
