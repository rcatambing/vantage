import { apiFetch } from "../../../../lib/api/client";
import type { N29Data, N29Params } from "../types";

const BASE = "/analytics/metrics/N29";

export function fetchN29(params: N29Params): Promise<N29Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.affiliation_type != null) qs.set("affiliation_type", params.affiliation_type);
  if (params.override_threshold != null) qs.set("override_threshold", String(params.override_threshold));
  return apiFetch<N29Data>(`${BASE}?${qs.toString()}`);
}
