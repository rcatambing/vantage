export interface N27DistrictBreakdown {
  district_id: number;
  district_name: string;
  signal_coverage: number;
  affiliation_coverage: number;
  leader_presence: number;
  poll_participation: number;
  completeness_score: number;
}

export interface N27Data {
  metric: string;
  campaign_id: number;
  average_completeness: number;
  district_count: number;
  district_breakdown: N27DistrictBreakdown[];
  computed_at: string;
}

export interface N27Params {
  campaign_id: string;
  district_id?: number;
  completeness_threshold?: number;
}
