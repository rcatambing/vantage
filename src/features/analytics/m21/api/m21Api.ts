import { apiFetch } from "../../../../lib/api/client";
import type { M21Data, M21Params } from "../types";

const BASE = "/analytics/metrics/M21";

export function fetchM21(params: M21Params): Promise<M21Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.bucket) qs.set("bucket", params.bucket);
  return apiFetch<M21Data>(`${BASE}?${qs.toString()}`);
}
