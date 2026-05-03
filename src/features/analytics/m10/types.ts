export type M10Granularity = "day" | "week" | "month";

export interface M10Summary {
  total_scope_count: number;
  remaining_open_count: number;
  human_completed_count: number;
  force_closed_count: number;
  headline_completion_rate: number | null;
  human_completion_rate: number | null;
  force_closure_rate: number | null;
}

export interface M10TrendBucket {
  bucket_start: string;
  bucket_end: string;
  created_count: number;
  completed_human_count: number;
  completed_force_closed_count: number;
  remaining_open_count: number;
  headline_completion_rate: number | null;
}

export interface M10Metadata {
  from_date: string | null;
  to_date: string | null;
  granularity: M10Granularity;
  timezone: string;
  include_cancelled: boolean;
  include_series: boolean;
  timestamp_source?: string;
  unsupported_filters?: Record<string, string>;
  filters_applied?: {
    campaign_id: string | number;
    objective_id?: string | number | null;
    assignee?: Array<string | number> | null;
  };
}

export interface M10Response {
  metric_code: string;
  campaign_id: string | number;
  summary: M10Summary;
  trend: M10TrendBucket[];
  metadata: M10Metadata;
}

export interface M10Params {
  campaign_id: string;
  objective_id?: string;
  assignee?: string[];
  task_type?: string[];
  from_date?: string;
  to_date?: string;
  granularity?: M10Granularity;
  timezone?: string;
  include_cancelled?: boolean;
  include_series?: boolean;
}
