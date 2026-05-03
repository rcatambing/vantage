import { apiFetch } from "../../../../lib/api/client";
import type { N08Data, N08Params } from "../types";

const BASE = "/analytics/metrics/N08";

export function fetchN08(params: N08Params): Promise<N08Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N08Data>(`${BASE}?${qs.toString()}`);
}
