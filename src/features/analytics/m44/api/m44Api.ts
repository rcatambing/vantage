import { apiFetch } from "../../../../lib/api/client";
import type { M44Data, M44Params } from "../types";

const BASE = "/analytics/metrics/M44";

export function fetchM44(params: M44Params): Promise<M44Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.activity_type != null) qs.set("activity_type", params.activity_type);
  return apiFetch<M44Data>(`${BASE}?${qs.toString()}`);
}
