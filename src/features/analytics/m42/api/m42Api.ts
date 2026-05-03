import { apiFetch } from "../../../../lib/api/client";
import type { M42Data, M42Params } from "../types";

const BASE = "/analytics/metrics/M42";

export function fetchM42(params: M42Params): Promise<M42Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.contact_type != null) qs.set("contact_type", params.contact_type);
  return apiFetch<M42Data>(`${BASE}?${qs.toString()}`);
}
