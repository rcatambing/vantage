import { apiFetch } from "../../../../lib/api/client";
import type { N33Data, N33Params } from "../types";

const BASE = "/analytics/metrics/N33";

export function fetchN33(params: N33Params): Promise<N33Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.province != null) qs.set("province", params.province);
  return apiFetch<N33Data>(`${BASE}?${qs.toString()}`);
}
