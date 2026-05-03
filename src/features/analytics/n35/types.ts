export interface N35BracketBreakdown {
  income_bracket: string;
  start_persuadable_count: number;
  converted_count: number;
  conversion_rate: number;
}

export interface N35Data {
  metric: string;
  campaign_id: number;
  district_id: number | null;
  period_days: number;
  breakdown: N35BracketBreakdown[];
  computed_at: string;
}

export interface N35Params {
  campaign_id: string;
  district_id?: number;
  period_days?: number;
}
