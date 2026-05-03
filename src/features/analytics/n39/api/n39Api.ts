import { apiFetch } from "../../../../lib/api/client";
import type { N39Data, N39Params } from "../types";

const BASE = "/analytics/metrics/N39";

export function fetchN39(params: N39Params): Promise<N39Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.province != null) qs.set("province", params.province);
  return apiFetch<N39Data>(`${BASE}?${qs.toString()}`);
}
