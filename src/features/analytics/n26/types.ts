export interface N26TypeBreakdown {
  activity_type: string;
  total_activities: number;
  rescheduled_count: number;
  volatility_rate: number;
}

export interface N26Data {
  metric: string;
  campaign_id: number;
  volatility_rate: number;
  volatility_display: string;
  total_activities: number;
  rescheduled_count: number;
  lookback_days: number;
  type_breakdown: N26TypeBreakdown[];
  computed_at: string;
}

export interface N26Params {
  campaign_id: string;
  activity_type?: string;
  days?: number;
}
