export interface N07Data {
  metric: string;
  campaign_id: number;
  conflict_ratio: number | null;
  conflict_display: string;
  total_voters_with_signals: number;
  conflicting_voters: number;
  positive_signals_voters: number;
  negative_signals_voters: number;
  confidence_threshold: number;
  intensity_threshold: number;
  computed_at: string;
}

export interface N07Params {
  campaign_id: string;
  district_id?: number;
  confidence_threshold?: number;
  intensity_threshold?: number;
}
