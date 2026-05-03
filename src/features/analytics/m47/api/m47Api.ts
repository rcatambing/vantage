import { apiFetch } from "../../../../lib/api/client";
import type { M47Data, M47Params } from "../types";

const BASE = "/analytics/metrics/M47";

export function fetchM47(params: M47Params): Promise<M47Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.granularity != null) qs.set("granularity", params.granularity);
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<M47Data>(`${BASE}?${qs.toString()}`);
}
