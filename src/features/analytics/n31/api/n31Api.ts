import { apiFetch } from "../../../../lib/api/client";
import type { N31Data, N31Params } from "../types";

const BASE = "/analytics/metrics/N31";

export function fetchN31(params: N31Params): Promise<N31Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N31Data>(`${BASE}?${qs.toString()}`);
}
