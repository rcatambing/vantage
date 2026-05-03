import { apiFetch } from "../../../../lib/api/client";
import type { N25Data, N25Params } from "../types";

const BASE = "/analytics/metrics/N25";

export function fetchN25(params: N25Params): Promise<N25Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.severity != null) qs.set("severity", params.severity);
  return apiFetch<N25Data>(`${BASE}?${qs.toString()}`);
}
