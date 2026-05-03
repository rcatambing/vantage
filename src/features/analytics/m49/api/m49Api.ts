import { apiFetch } from "../../../../lib/api/client";
import type { M49Data, M49Params } from "../types";

const BASE = "/analytics/metrics/M49";

export function fetchM49(params: M49Params): Promise<M49Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.category != null) qs.set("category", params.category);
  return apiFetch<M49Data>(`${BASE}?${qs.toString()}`);
}
