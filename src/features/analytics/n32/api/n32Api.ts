import { apiFetch } from "../../../../lib/api/client";
import type { N32Data, N32Params } from "../types";

const BASE = "/analytics/metrics/N32";

export function fetchN32(params: N32Params): Promise<N32Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N32Data>(`${BASE}?${qs.toString()}`);
}
