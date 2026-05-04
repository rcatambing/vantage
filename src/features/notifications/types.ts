export interface Notification {
  notification_id: number;
  campaign_id: number | null;
  channel: string;
  title: string;
  message_body: string;
  target_audience: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface NotificationParams {
  campaign_id?: string;
  status?: string;
  channel?: string;
  page?: number;
  page_size?: number;
}
