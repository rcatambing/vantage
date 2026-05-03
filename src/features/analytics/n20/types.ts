export interface N20BlocBreakdown {
  affiliation_id: number;
  religion_name: string;
  member_count: number;
  avg_intensity: number;
  avg_confidence: number;
  confidence_gap: number;
  opportunity_score: number;
  opportunity_rank: number;
}

export interface N20Data {
  metric: string;
  campaign_id: number;
  total_religions: number;
  bloc_breakdown: N20BlocBreakdown[];
  computed_at: string;
}

export interface N20Params {
  campaign_id: string;
  district_id?: number;
}
