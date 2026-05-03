export interface M47TimelineEntry {
  period: string;
  posts: number;
  comments: number;
  total: number;
}

export interface M47Data {
  metric: string;
  campaign_id: number;
  granularity: string;
  days_lookback: number;
  total_posts: number;
  total_comments: number;
  total_activity: number;
  avg_per_period: number;
  period_count: number;
  timeline: M47TimelineEntry[];
  computed_at: string;
}

export interface M47Params {
  campaign_id: string;
  granularity?: string;
  days?: number;
}
