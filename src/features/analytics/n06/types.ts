export interface N06TypeBreakdown {
  affiliation_type: string;
  affiliation_type_name: string;
  total_affiliated: number;
  volatile_count: number;
  volatility_rate: number | null;
  volatility_display: string;
}

export interface N06Data {
  metric: string;
  campaign_id: number;
  volatility_rate: number | null;
  volatility_display: string;
  total_affiliated_voters: number;
  volatile_voters: number;
  days_lookback: number;
  type_breakdown: N06TypeBreakdown[];
  computed_at: string;
}

export interface N06Params {
  campaign_id: string;
  district_id?: number;
  days?: number;
}
