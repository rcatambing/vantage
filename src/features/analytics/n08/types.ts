export interface N08Data {
  metric: string;
  campaign_id: number;
  dependency_ratio: number | null;
  dependency_display: string;
  total_signals: number;
  derived_signals: number;
  manual_signals: number;
  computed_at: string;
}

export interface N08Params {
  campaign_id: string;
  district_id?: number;
}
