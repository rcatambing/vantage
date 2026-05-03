import { apiFetch } from "../../../../lib/api/client";
import type { M28Data, M28Params } from "../types";

const BASE = "/analytics/metrics/M28";

export function fetchM28(params: M28Params): Promise<M28Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_type) qs.set("district_type", params.district_type);
  return apiFetch<M28Data>(`${BASE}?${qs.toString()}`);
}
