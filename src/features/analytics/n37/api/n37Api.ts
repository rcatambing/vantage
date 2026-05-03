import { apiFetch } from "../../../../lib/api/client";
import type { N37Data, N37Params } from "../types";

const BASE = "/analytics/metrics/N37";

export function fetchN37(params: N37Params): Promise<N37Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.province != null) qs.set("province", params.province);
  if (params.urban_classes != null) qs.set("urban_classes", params.urban_classes);
  if (params.rural_classes != null) qs.set("rural_classes", params.rural_classes);
  return apiFetch<N37Data>(`${BASE}?${qs.toString()}`);
}
