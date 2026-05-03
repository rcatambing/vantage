export interface N18Data {
  metric: string;
  campaign_id: number;
  flip_rate: number | null;
  flip_display: string;
  lean_opponents_contacted: number;
  flipped_count: number;
  flipped_to_supporter: number;
  flipped_to_persuadable: number;
  period_days: number;
  computed_at: string;
}

export interface N18Params {
  campaign_id: string;
  district_id?: number;
  period_days?: number;
}
