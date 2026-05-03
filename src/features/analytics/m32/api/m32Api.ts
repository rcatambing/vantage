import { apiFetch } from "../../../../lib/api/client";
import type { M32Data, M32Params } from "../types";

const BASE = "/analytics/metrics/M32";

export function fetchM32(params: M32Params): Promise<M32Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M32Data>(`${BASE}?${qs.toString()}`);
}
