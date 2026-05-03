import { apiFetch } from "../../../../lib/api/client";
import type { N28Data, N28Params } from "../types";

const BASE = "/analytics/metrics/N28";

export function fetchN28(params: N28Params): Promise<N28Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.signal_type_code != null) qs.set("signal_type_code", params.signal_type_code);
  return apiFetch<N28Data>(`${BASE}?${qs.toString()}`);
}
