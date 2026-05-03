export interface M15Data {
  metric_code: string;
  active_count: number;
  total_count: number;
  by_status: Record<string, number>;
  computed_at: string;
}

export interface M15Params {
  campaign_type?: string;
}
