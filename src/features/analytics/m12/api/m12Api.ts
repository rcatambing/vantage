import { apiFetch } from "../../../../lib/api/client";
import type { M12Data, M12Params } from "../types";

const BASE = "/analytics/metrics/M12";

export function fetchM12MilestoneProgress(params: M12Params): Promise<M12Data> {
  const qs = new URLSearchParams({ campaign_id: params.campaign_id });
  if (params.task_id) qs.set("task_id", params.task_id);
  return apiFetch<M12Data>(`${BASE}?${qs.toString()}`);
}
