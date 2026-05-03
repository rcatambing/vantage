import { apiFetch } from "../../../../lib/api/client";
import type { N07Data, N07Params } from "../types";

const BASE = "/analytics/metrics/N07";

export function fetchN07(params: N07Params): Promise<N07Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.confidence_threshold != null) qs.set("confidence_threshold", String(params.confidence_threshold));
  if (params.intensity_threshold != null) qs.set("intensity_threshold", String(params.intensity_threshold));
  return apiFetch<N07Data>(`${BASE}?${qs.toString()}`);
}
