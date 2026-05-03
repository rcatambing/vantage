import { apiFetch } from "../../../../lib/api/client";
import type { N13Data, N13Params } from "../types";

const BASE = "/analytics/metrics/N13";

export function fetchN13(params: N13Params): Promise<N13Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<N13Data>(`${BASE}?${qs.toString()}`);
}
