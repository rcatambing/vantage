import { apiFetch } from "../../../../lib/api/client";
import type { M46Data, M46Params } from "../types";

const BASE = "/analytics/metrics/M46";

export function fetchM46(params: M46Params): Promise<M46Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.material_type != null) qs.set("material_type", params.material_type);
  return apiFetch<M46Data>(`${BASE}?${qs.toString()}`);
}
