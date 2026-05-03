import { apiFetch } from "../../../../lib/api/client";
import type { M30Data, M30Params } from "../types";

const BASE = "/analytics/metrics/M30";

export function fetchM30(params: M30Params): Promise<M30Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M30Data>(`${BASE}?${qs.toString()}`);
}
