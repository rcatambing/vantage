import { apiFetch } from "../../../../lib/api/client";
import type { M18Data, M18Params } from "../types";

const BASE = "/analytics/metrics/M18";

export function fetchM18(params: M18Params): Promise<M18Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.poll_id != null) qs.set("poll_id", String(params.poll_id));
  if (params.unfavorable_threshold != null)
    qs.set("unfavorable_threshold", String(params.unfavorable_threshold));
  return apiFetch<M18Data>(`${BASE}?${qs.toString()}`);
}
