import { apiFetch } from "../../../../lib/api/client";
import type { M35Data, M35Params } from "../types";

const BASE = "/analytics/metrics/M35";

export function fetchM35(params: M35Params): Promise<M35Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.contact_type != null) qs.set("contact_type", params.contact_type);
  return apiFetch<M35Data>(`${BASE}?${qs.toString()}`);
}
