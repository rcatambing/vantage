export interface N17Data {
  metric: string;
  campaign_id: number;
  resolution_rate: number | null;
  resolution_display: string;
  persuadable_at_start: number;
  resolved_to_decided: number;
  resolved_for: number;
  resolved_against: number;
  period_days: number;
  computed_at: string;
}

export interface N17Params {
  campaign_id: string;
  district_id?: number;
  period_days?: number;
}
