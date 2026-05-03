import { apiFetch } from "../../../../lib/api/client";
import type { N36Data, N36Params } from "../types";

const BASE = "/analytics/metrics/N36";

export function fetchN36(params: N36Params): Promise<N36Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N36Data>(`${BASE}?${qs.toString()}`);
}
