import { apiFetch } from "../../../../lib/api/client";
import type { N02Data, N02Params } from "../types";

const BASE = "/analytics/metrics/N02";

export function fetchN02(params: N02Params): Promise<N02Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.confidence_threshold != null) qs.set("confidence_threshold", String(params.confidence_threshold));
  return apiFetch<N02Data>(`${BASE}?${qs.toString()}`);
}
