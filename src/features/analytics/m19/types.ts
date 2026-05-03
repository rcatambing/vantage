export interface M19TrendPoint {
  poll_id: number;
  poll_name: string;
  start_at: string | null;
  favorability_rate: number | null;
  unfavorability_rate: number | null;
  net_favorability: number | null;
}

export interface M19Data {
  metric: string;
  campaign_id: number;
  poll_id: number | null;
  favorable_threshold: number;
  unfavorable_threshold: number;
  favorability_rate: number | null;
  unfavorability_rate: number | null;
  net_favorability: number | null;
  eligible_count: number;
  trend: M19TrendPoint[];
  computed_at: string;
}

export interface M19Params {
  campaign_id: string;
}
