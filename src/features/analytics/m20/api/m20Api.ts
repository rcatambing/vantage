import { apiFetch } from "../../../../lib/api/client";
import type { M20Data, M20Params } from "../types";

const BASE = "/analytics/metrics/M20";

export function fetchM20(params: M20Params): Promise<M20Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.limit != null) qs.set("limit", String(params.limit));
  return apiFetch<M20Data>(`${BASE}?${qs.toString()}`);
}
