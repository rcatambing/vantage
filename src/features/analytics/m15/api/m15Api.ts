import { apiFetch } from "../../../../lib/api/client";
import type { M15Data, M15Params } from "../types";

const BASE = "/analytics/metrics/M15";

export function fetchM15ActiveCampaigns(params: M15Params = {}): Promise<M15Data> {
  const qs = new URLSearchParams();
  if (params.campaign_type) qs.set("campaign_type", params.campaign_type);
  const query = qs.toString();
  return apiFetch<M15Data>(query ? `${BASE}?${query}` : BASE);
}
