import { apiFetch } from "../../../../lib/api/client";
import type { N34Data, N34Params } from "../types";

const BASE = "/analytics/metrics/N34";

export function fetchN34(params: N34Params): Promise<N34Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.province != null) qs.set("province", params.province);
  if (params.cwss_range != null) qs.set("cwss_range", params.cwss_range);
  return apiFetch<N34Data>(`${BASE}?${qs.toString()}`);
}
