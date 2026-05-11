import { apiFetch } from "../../../../lib/api/client";
import type { N30Data, N30Params } from "../types";

const BASE = "/analytics/metrics/N30";

export function fetchN30(params: N30Params): Promise<N30Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.poll_id != null) qs.set("poll_id", String(params.poll_id));
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N30Data>(`${BASE}?${qs.toString()}`);
}
