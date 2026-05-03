import { apiFetch } from "../../../../lib/api/client";
import type { M36Data, M36Params } from "../types";

const BASE = "/analytics/metrics/M36";

export function fetchM36(params: M36Params): Promise<M36Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M36Data>(`${BASE}?${qs.toString()}`);
}
