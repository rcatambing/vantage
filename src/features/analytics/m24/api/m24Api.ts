import { apiFetch } from "../../../../lib/api/client";
import type { M24Data, M24Params } from "../types";

const BASE = "/analytics/metrics/M24";

export function fetchM24(params: M24Params): Promise<M24Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.poll_id != null) qs.set("poll_id", String(params.poll_id));
  return apiFetch<M24Data>(`${BASE}?${qs.toString()}`);
}
