import { apiFetch } from "../../../../lib/api/client";
import type { M31Data, M31Params } from "../types";

const BASE = "/analytics/metrics/M31";

export function fetchM31(params: M31Params): Promise<M31Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M31Data>(`${BASE}?${qs.toString()}`);
}
