import { apiFetch } from "../../../lib/api/client";
import type { CampaignActivity, ActivityListResponse, ActivityParams } from "../types";

const BASE = "/activities";

export function fetchActivities(params: ActivityParams): Promise<ActivityListResponse> {
  const qs = new URLSearchParams();
  if (params.campaign_id) qs.set("campaign_id", params.campaign_id);
  if (params.status) qs.set("status", params.status);
  if (params.activity_type) qs.set("activity_type", params.activity_type);
  if (params.from_date) qs.set("from_date", params.from_date);
  if (params.to_date) qs.set("to_date", params.to_date);
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));
  return apiFetch<ActivityListResponse>(`${BASE}?${qs.toString()}`);
}

export function fetchActivity(id: number): Promise<CampaignActivity> {
  return apiFetch<CampaignActivity>(`${BASE}/${id}`);
}
