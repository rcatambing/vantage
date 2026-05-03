import { apiFetch } from "../../../../lib/api/client";
import type { M53Data, M53Params } from "../types";

const BASE = "/analytics/metrics/M53";

export function fetchM53(params: M53Params): Promise<M53Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.days != null) qs.set("days", String(params.days));
  return apiFetch<M53Data>(`${BASE}?${qs.toString()}`);
}
