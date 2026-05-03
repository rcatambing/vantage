import { apiFetch } from "../../../../lib/api/client";
import type { N12Data, N12Params } from "../types";

const BASE = "/analytics/metrics/N12";

export function fetchN12(params: N12Params): Promise<N12Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.influence_level != null) qs.set("influence_level", params.influence_level);
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<N12Data>(`${BASE}?${qs.toString()}`);
}
