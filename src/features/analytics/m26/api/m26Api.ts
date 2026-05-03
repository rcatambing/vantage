import { apiFetch } from "../../../../lib/api/client";
import type { M26Data, M26Params } from "../types";

const BASE = "/analytics/metrics/M26";

export function fetchM26(params: M26Params): Promise<M26Data> {
  const qs = new URLSearchParams({
    campaign_id: String(params.campaign_id),
    our_candidate: params.our_candidate,
    opponent_candidate: params.opponent_candidate,
  });
  if (params.poll_id != null) qs.set("poll_id", String(params.poll_id));
  if (params.confidence_level != null) qs.set("confidence_level", String(params.confidence_level));
  return apiFetch<M26Data>(`${BASE}?${qs.toString()}`);
}
