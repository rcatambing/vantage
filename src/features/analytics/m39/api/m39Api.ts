import { apiFetch } from "../../../../lib/api/client";
import type { M39Data, M39Params } from "../types";

const BASE = "/analytics/metrics/M39";

export function fetchM39(params: M39Params): Promise<M39Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M39Data>(`${BASE}?${qs.toString()}`);
}
