import { apiFetch } from "../../../lib/api/client";
import type { Notification, NotificationListResponse, NotificationParams } from "../types";

const BASE = "/notifications";

export function fetchNotifications(params: NotificationParams = {}): Promise<NotificationListResponse> {
  const qs = new URLSearchParams();
  if (params.campaign_id) qs.set("campaign_id", params.campaign_id);
  if (params.status) qs.set("status", params.status);
  if (params.channel) qs.set("channel", params.channel);
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));
  const query = qs.toString();
  return apiFetch<NotificationListResponse>(`${BASE}?${query}`);
}

export function fetchNotification(id: number): Promise<Notification> {
  return apiFetch<Notification>(`${BASE}/${id}`);
}
