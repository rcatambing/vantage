export interface N36Bracket {
  income_bracket: string;
  avg_intensity: number;
  voter_count: number;
}

export interface N36DistrictBreakdown {
  district_id: number;
  district_name: string;
  intensity_gap: number;
  brackets: N36Bracket[];
}

export interface N36Data {
  metric: string;
  campaign_id: number;
  district_id: number | null;
  district_breakdown: N36DistrictBreakdown[];
  computed_at: string;
}

export interface N36Params {
  campaign_id: string;
  district_id?: number;
}
