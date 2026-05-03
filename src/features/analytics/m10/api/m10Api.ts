import { apiFetch } from "../../../../lib/api/client";
import type { M10Response, M10Params } from "../types";

const BASE = "/analytics/metrics/M10";

function appendList(qs: URLSearchParams, key: string, values?: string[]) {
  if (!values || values.length === 0) {
    return;
  }
  values.forEach((value) => {
    const trimmed = value.trim();
    if (trimmed) {
      qs.append(key, trimmed);
    }
  });
}

export function fetchM10TaskCompletion(params: M10Params): Promise<M10Response> {
  const qs = new URLSearchParams({ campaign_id: params.campaign_id });
  if (params.objective_id) qs.set("objective_id", params.objective_id);
  appendList(qs, "assignee", params.assignee);
  appendList(qs, "task_type", params.task_type);
  if (params.from_date) qs.set("from_date", params.from_date);
  if (params.to_date) qs.set("to_date", params.to_date);
  if (params.granularity) qs.set("granularity", params.granularity);
  if (params.timezone) qs.set("timezone", params.timezone);
  if (params.include_cancelled != null) qs.set("include_cancelled", String(params.include_cancelled));
  if (params.include_series != null) qs.set("include_series", String(params.include_series));
  return apiFetch<M10Response>(`${BASE}?${qs.toString()}`);
}
