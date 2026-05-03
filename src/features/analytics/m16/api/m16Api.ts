import { apiFetch } from "../../../../lib/api/client";
import type { M16Data, M16Params } from "../types";

const BASE = "/analytics/metrics/M16";

export function fetchM16ObjTaskRatio(params: M16Params): Promise<M16Data> {
  const qs = new URLSearchParams({ campaign_id: params.campaign_id });
  return apiFetch<M16Data>(`${BASE}?${qs.toString()}`);
}
