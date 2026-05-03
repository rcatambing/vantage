export interface N19GroupBreakdown {
  affiliation_id: number;
  group_name: string;
  member_count: number;
  avg_affinity: number;
  support_dispersion: number;
  potential_score: number;
}

export interface N19Data {
  metric: string;
  campaign_id: number;
  total_groups: number;
  group_breakdown: N19GroupBreakdown[];
  computed_at: string;
}

export interface N19Params {
  campaign_id: string;
  district_id?: number;
}
