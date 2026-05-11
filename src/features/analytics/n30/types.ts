export interface N30DistrictBreakdown {
  district_id: number;
  district_name: string;
  poll_support_pct: number;
  signal_support_pct: number;
  divergence_index: number;
  poll_participants: number;
  signal_count: number;
}

export interface N30Summary {
  avg_divergence_index: number | null;
  avg_divergence_display: string;
  districts_analyzed: number;
}

export interface N30Data {
  metric: string;
  campaign_id: number;
  poll_filter: number | null;
  district_filter: number | null;
  computed_at: string;
  summary: N30Summary;
  district_breakdown: N30DistrictBreakdown[];
}

export interface N30Params {
  campaign_id: string;
  poll_id?: number;
  district_id?: number;
}
