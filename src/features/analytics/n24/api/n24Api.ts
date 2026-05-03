import { apiFetch } from "../../../../lib/api/client";
import type { N24Data, N24Params } from "../types";

const BASE = "/analytics/metrics/N24";

export function fetchN24(params: N24Params): Promise<N24Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<N24Data>(`${BASE}?${qs.toString()}`);
}
