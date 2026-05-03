import { apiFetch } from "../../../../lib/api/client";
import type { M17Data, M17Params } from "../types";

const BASE = "/analytics/metrics/M17";

export function fetchM17(params: M17Params): Promise<M17Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.poll_id != null) qs.set("poll_id", String(params.poll_id));
  if (params.favorable_threshold != null)
    qs.set("favorable_threshold", String(params.favorable_threshold));
  return apiFetch<M17Data>(`${BASE}?${qs.toString()}`);
}
