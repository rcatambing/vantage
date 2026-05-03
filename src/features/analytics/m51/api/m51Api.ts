import { apiFetch } from "../../../../lib/api/client";
import type { M51Data, M51Params } from "../types";

const BASE = "/analytics/metrics/M51";

export function fetchM51(params: M51Params): Promise<M51Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<M51Data>(`${BASE}?${qs.toString()}`);
}
