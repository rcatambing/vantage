import { apiFetch } from "../../../../lib/api/client";
import type { M27Data, M27Params } from "../types";

const BASE = "/analytics/metrics/M27";

export function fetchM27(params: M27Params): Promise<M27Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.include_inactive != null) qs.set("include_inactive", String(params.include_inactive));
  return apiFetch<M27Data>(`${BASE}?${qs.toString()}`);
}
