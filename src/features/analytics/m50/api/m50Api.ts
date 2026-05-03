import { apiFetch } from "../../../../lib/api/client";
import type { M50Data, M50Params } from "../types";

const BASE = "/analytics/metrics/M50";

export function fetchM50(params: M50Params): Promise<M50Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.contact_type != null) qs.set("contact_type", params.contact_type);
  return apiFetch<M50Data>(`${BASE}?${qs.toString()}`);
}
