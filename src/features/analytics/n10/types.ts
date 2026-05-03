export interface N10DistrictBreakdown {
  district_id: number;
  total_key_influencers: number;
  activated: number;
  activation_rate: number | null;
  activation_display: string;
}

export interface N10Data {
  metric: string;
  campaign_id: number;
  activation_rate: number | null;
  activation_display: string;
  total_key_influencers: number;
  activated_count: number;
  days_window: number;
  district_breakdown: N10DistrictBreakdown[];
  computed_at: string;
}

export interface N10Params {
  campaign_id: string;
  district_id?: number;
  days_window?: number;
}
