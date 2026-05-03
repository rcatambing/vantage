export interface N16Data {
  metric: string;
  campaign_id: number;
  velocity: number | null;
  velocity_display: string;
  moved_to_supporter: number;
  moved_out_of_supporter: number;
  start_persuadable_count: number;
  period_days: number;
  computed_at: string;
}

export interface N16Params {
  campaign_id: string;
  district_id?: number;
  period_days?: number;
}
