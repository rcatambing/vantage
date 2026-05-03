import { apiFetch } from "../../../../lib/api/client";
import type { N11Data, N11Params } from "../types";

const BASE = "/analytics/metrics/N11";

export function fetchN11(params: N11Params): Promise<N11Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.influence_level != null) qs.set("influence_level", params.influence_level);
  return apiFetch<N11Data>(`${BASE}?${qs.toString()}`);
}
