import { apiFetch } from "../../../../lib/api/client";
import type { M48Data, M48Params } from "../types";

const BASE = "/analytics/metrics/M48";

export function fetchM48(params: M48Params): Promise<M48Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<M48Data>(`${BASE}?${qs.toString()}`);
}
