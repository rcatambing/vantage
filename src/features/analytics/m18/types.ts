export interface M18Data {
  metric: string;
  campaign_id: number;
  poll_id: number | null;
  unfavorable_threshold: number;
  unfavorable_count: number;
  eligible_count: number;
  unfavorability_rate: number | null;
  computed_at: string;
}

export interface M18Params {
  campaign_id: string;
  poll_id?: number;
  unfavorable_threshold?: number;
}
