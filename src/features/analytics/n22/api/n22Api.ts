import { apiFetch } from "../../../../lib/api/client";
import type { N22Data, N22Params } from "../types";

const BASE = "/analytics/metrics/N22";

export function fetchN22(params: N22Params): Promise<N22Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.days_window != null) qs.set("days_window", String(params.days_window));
  return apiFetch<N22Data>(`${BASE}?${qs.toString()}`);
}
