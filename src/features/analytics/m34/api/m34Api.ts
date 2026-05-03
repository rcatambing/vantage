import { apiFetch } from "../../../../lib/api/client";
import type { M34Data, M34Params } from "../types";

const BASE = "/analytics/metrics/M34";

export function fetchM34(params: M34Params): Promise<M34Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M34Data>(`${BASE}?${qs.toString()}`);
}
