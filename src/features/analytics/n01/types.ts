export interface N01DistrictBreakdown {
  district_id: number;
  district_name: string;
  signal_count: number;
  sfi: number | null;
  sfi_display: string;
}

export interface N01Data {
  metric: string;
  campaign_id: number;
  sfi: number | null;
  sfi_display: string;
  half_life_days: number;
  total_signals: number;
  district_breakdown: N01DistrictBreakdown[];
  computed_at: string;
}

export interface N01Params {
  campaign_id: string;
  district_id?: number;
  signal_type?: string;
  confidence_threshold?: number;
}
