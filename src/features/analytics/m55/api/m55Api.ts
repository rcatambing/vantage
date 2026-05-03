import { apiFetch } from "../../../../lib/api/client";
import type { M55Data, M55Params } from "../types";

const BASE = "/analytics/metrics/M55";

export function fetchM55(params: M55Params): Promise<M55Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<M55Data>(`${BASE}?${qs.toString()}`);
}
