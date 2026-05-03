import { apiFetch } from "../../../../lib/api/client";
import type { M45Data, M45Params } from "../types";

const BASE = "/analytics/metrics/M45";

export function fetchM45(params: M45Params): Promise<M45Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.platform != null) qs.set("platform", params.platform);
  return apiFetch<M45Data>(`${BASE}?${qs.toString()}`);
}
