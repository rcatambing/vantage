export interface M17Data {
  metric: string;
  campaign_id: number;
  poll_id: number | null;
  favorable_threshold: number;
  favorable_count: number;
  eligible_count: number;
  favorability_rate: number | null;
  computed_at: string;
}

export interface M17Params {
  campaign_id: string;
  poll_id?: number;
  favorable_threshold?: number;
}
