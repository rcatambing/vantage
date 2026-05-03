import { apiFetch } from "../../../../lib/api/client";
import type { N04Data, N04Params } from "../types";

const BASE = "/analytics/metrics/N04";

export function fetchN04(params: N04Params): Promise<N04Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.affiliation_type != null) qs.set("affiliation_type", params.affiliation_type);
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N04Data>(`${BASE}?${qs.toString()}`);
}
