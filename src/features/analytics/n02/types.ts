export interface N02DistrictBreakdown {
  district_id: number;
  district_name: string;
  voter_count: number;
  cwss: number | null;
  cwss_display: string;
}

export interface N02Data {
  metric: string;
  campaign_id: number;
  cwss: number | null;
  cwss_display: string;
  total_voters: number;
  voters_with_signals: number;
  district_breakdown: N02DistrictBreakdown[];
  computed_at: string;
}

export interface N02Params {
  campaign_id: string;
  district_id?: number;
  confidence_threshold?: number;
}
