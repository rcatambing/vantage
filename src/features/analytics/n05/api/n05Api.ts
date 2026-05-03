import { apiFetch } from "../../../../lib/api/client";
import type { N05Data, N05Params } from "../types";

const BASE = "/analytics/metrics/N05";

export function fetchN05(params: N05Params): Promise<N05Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.affiliation_type != null) qs.set("affiliation_type", params.affiliation_type);
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  return apiFetch<N05Data>(`${BASE}?${qs.toString()}`);
}
