import { apiFetch } from "../../../../lib/api/client";
import type { M43Data, M43Params } from "../types";

const BASE = "/analytics/metrics/M43";

export function fetchM43(params: M43Params): Promise<M43Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<M43Data>(`${BASE}?${qs.toString()}`);
}
