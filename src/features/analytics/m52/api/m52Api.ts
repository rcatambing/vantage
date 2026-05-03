import { apiFetch } from "../../../../lib/api/client";
import type { M52Data, M52Params } from "../types";

const BASE = "/analytics/metrics/M52";

export function fetchM52(params: M52Params): Promise<M52Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<M52Data>(`${BASE}?${qs.toString()}`);
}
