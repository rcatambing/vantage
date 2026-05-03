export interface N05AffiliationBreakdown {
  affiliation_id: number;
  affiliation_name: string;
  affiliation_type: string;
  member_count: number;
  members_with_signals: number;
  avg_member_cwss: number | null;
  avg_non_member_cwss: number | null;
  lift: number | null;
  lift_display: string;
}

export interface N05Data {
  metric: string;
  campaign_id: number;
  overall_lift: number | null;
  lift_display: string;
  affiliation_count: number;
  affiliation_breakdown: N05AffiliationBreakdown[];
  computed_at: string;
}

export interface N05Params {
  campaign_id: string;
  affiliation_type?: string;
  district_id?: number;
}
