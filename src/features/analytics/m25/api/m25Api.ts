import { apiFetch } from "../../../../lib/api/client";
import type { M25Data, M25Params } from "../types";

const BASE = "/analytics/metrics/M25";

export function fetchM25(params: M25Params): Promise<M25Data> {
  const qs = new URLSearchParams({
    campaign_id: String(params.campaign_id),
    our_candidate: params.our_candidate,
  });
  if (params.poll_id != null) qs.set("poll_id", String(params.poll_id));
  if (params.candidates) qs.set("candidates", params.candidates);
  return apiFetch<M25Data>(`${BASE}?${qs.toString()}`);
}
