import { apiFetch } from "../../../../lib/api/client";
import type { M23Data, M23Params } from "../types";

const BASE = "/analytics/metrics/M23";

export function fetchM23(params: M23Params): Promise<M23Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.poll_id != null) qs.set("poll_id", String(params.poll_id));
  return apiFetch<M23Data>(`${BASE}?${qs.toString()}`);
}
