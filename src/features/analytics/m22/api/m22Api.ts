import { apiFetch } from "../../../../lib/api/client";
import type { M22Data, M22Params } from "../types";

const BASE = "/analytics/metrics/M22";

export function fetchM22(params: M22Params): Promise<M22Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M22Data>(`${BASE}?${qs.toString()}`);
}
