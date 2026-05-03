export interface N15StageDistribution {
  stage: string;
  count: number;
  percentage: number;
}

export interface N15DistrictBreakdown {
  district_id: number;
  total_voters: number;
  strong_supporter_count: number;
  lean_supporter_count: number;
  persuadable_count: number;
  lean_opponent_count: number;
  strong_opponent_count: number;
  dominant_stage: string;
}

export interface N15Data {
  metric: string;
  campaign_id: number;
  total_voters: number;
  stage_distribution: N15StageDistribution[];
  district_breakdown: N15DistrictBreakdown[];
  computed_at: string;
}

export interface N15Params {
  campaign_id: string;
  district_id?: number;
}
