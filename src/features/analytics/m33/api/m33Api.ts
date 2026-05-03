import { apiFetch } from "../../../../lib/api/client";
import type { M33Data, M33Params } from "../types";

const BASE = "/analytics/metrics/M33";

export function fetchM33(params: M33Params): Promise<M33Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M33Data>(`${BASE}?${qs.toString()}`);
}
