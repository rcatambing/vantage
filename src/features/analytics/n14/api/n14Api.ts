import { apiFetch } from "../../../../lib/api/client";
import type { N14Data, N14Params } from "../types";

const BASE = "/analytics/metrics/N14";

export function fetchN14(params: N14Params): Promise<N14Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N14Data>(`${BASE}?${qs.toString()}`);
}
