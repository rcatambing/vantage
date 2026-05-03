import { apiFetch } from "../../../../lib/api/client";
import type { N01Data, N01Params } from "../types";

const BASE = "/analytics/metrics/N01";

export function fetchN01(params: N01Params): Promise<N01Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.signal_type != null) qs.set("signal_type", params.signal_type);
  if (params.confidence_threshold != null) qs.set("confidence_threshold", String(params.confidence_threshold));
  return apiFetch<N01Data>(`${BASE}?${qs.toString()}`);
}
