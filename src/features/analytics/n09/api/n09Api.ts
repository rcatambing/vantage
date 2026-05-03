import { apiFetch } from "../../../../lib/api/client";
import type { N09Data, N09Params } from "../types";

const BASE = "/analytics/metrics/N09";

export function fetchN09(params: N09Params): Promise<N09Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.influence_level != null) qs.set("influence_level", params.influence_level);
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<N09Data>(`${BASE}?${qs.toString()}`);
}
