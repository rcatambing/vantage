import { apiFetch } from "../../../../lib/api/client";
import type { M38Data, M38Params } from "../types";

const BASE = "/analytics/metrics/M38";

export function fetchM38(params: M38Params): Promise<M38Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  return apiFetch<M38Data>(`${BASE}?${qs.toString()}`);
}
