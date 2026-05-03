export interface N29AffiliationBreakdown {
  affiliation_id: number;
  total_derived: number;
  override_count: number;
  override_rate: number;
  avg_deviation: number;
}

export interface N29Data {
  metric: string;
  campaign_id: number;
  override_rate: number;
  override_display: string;
  total_derived_signals: number;
  override_count: number;
  override_threshold: number;
  affiliation_breakdown: N29AffiliationBreakdown[];
  computed_at: string;
}

export interface N29Params {
  campaign_id: string;
  affiliation_type?: string;
  override_threshold?: number;
}
