export interface N11LevelBreakdown {
  influence_level: string;
  total_leaders: number;
  compliant: number;
  required_events: number;
  window_days: number;
  compliance_rate: number | null;
  compliance_display: string;
}

export interface N11NonCompliantLeader {
  leader_id: number;
  leader_name: string;
  influence_level: string;
  events_in_window: number;
  required_events: number;
  window_days: number;
}

export interface N11Data {
  metric: string;
  campaign_id: number;
  compliance_rate: number | null;
  compliance_display: string;
  total_leaders: number;
  compliant_count: number;
  non_compliant_count: number;
  level_breakdown: N11LevelBreakdown[];
  non_compliant_leaders: N11NonCompliantLeader[];
  computed_at: string;
}

export interface N11Params {
  campaign_id: string;
  district_id?: number;
  influence_level?: string;
}
