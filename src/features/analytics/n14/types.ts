export interface N14DistrictBreakdown {
  district_id: number;
  target_points: number;
  current_points: number;
  gap: number;
  gap_status: string;
  leader_count: number;
  supporter_count: number;
  opponent_count: number;
  neutral_count: number;
}

export interface N14Data {
  metric: string;
  campaign_id: number;
  total_target_points: number;
  total_current_points: number;
  total_gap: number;
  gap_status: string;
  district_count: number;
  district_breakdown: N14DistrictBreakdown[];
  computed_at: string;
}

export interface N14Params {
  campaign_id: string;
  district_id?: number;
}
