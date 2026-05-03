import { apiFetch } from "../../../../lib/api/client";
import type { N26Data, N26Params } from "../types";

const BASE = "/analytics/metrics/N26";

export function fetchN26(params: N26Params): Promise<N26Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.activity_type != null) qs.set("activity_type", params.activity_type);
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<N26Data>(`${BASE}?${qs.toString()}`);
}
