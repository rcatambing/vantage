import { apiFetch } from "../../../../lib/api/client";
import type { M40Data, M40Params } from "../types";

const BASE = "/analytics/metrics/M40";

export function fetchM40(params: M40Params): Promise<M40Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M40Data>(`${BASE}?${qs.toString()}`);
}
