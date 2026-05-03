import { apiFetch } from "../../../../lib/api/client";
import type { N21Data, N21Params } from "../types";

const BASE = "/analytics/metrics/N21";

export function fetchN21(params: N21Params): Promise<N21Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N21Data>(`${BASE}?${qs.toString()}`);
}
