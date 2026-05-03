export interface N13DistrictBreakdown {
  district_id: number;
  issue_count: number;
  active_leaders: number;
  pressure_rate: number;
}

export interface N13LeaderBreakdown {
  leader_id: number;
  leader_name: string;
  influence_level: string;
  district_id: number;
  issue_count: number;
}

export interface N13Data {
  metric: string;
  campaign_id: number;
  pressure_rate: number | null;
  pressure_display: string;
  total_issue_events: number;
  total_active_leaders: number;
  district_breakdown: N13DistrictBreakdown[];
  leader_breakdown: N13LeaderBreakdown[];
  lookback_days: number;
  computed_at: string;
}

export interface N13Params {
  campaign_id: string;
  district_id?: number;
  days?: number;
}
