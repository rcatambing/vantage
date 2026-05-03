import { apiFetch } from "../../../../lib/api/client";
import type { M54Data, M54Params } from "../types";

const BASE = "/analytics/metrics/M54";

export function fetchM54(params: M54Params): Promise<M54Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.severity != null) qs.set("severity", params.severity);
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<M54Data>(`${BASE}?${qs.toString()}`);
}
