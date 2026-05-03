import { apiFetch } from "../../../../lib/api/client";
import type { N19Data, N19Params } from "../types";

const BASE = "/analytics/metrics/N19";

export function fetchN19(params: N19Params): Promise<N19Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N19Data>(`${BASE}?${qs.toString()}`);
}
