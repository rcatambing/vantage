import { apiFetch } from "../../../../lib/api/client";
import type { N10Data, N10Params } from "../types";

const BASE = "/analytics/metrics/N10";

export function fetchN10(params: N10Params): Promise<N10Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.days_window != null) qs.set("days_window", String(params.days_window));
  return apiFetch<N10Data>(`${BASE}?${qs.toString()}`);
}
