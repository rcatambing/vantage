export interface N28TypeBreakdown {
  signal_type_code: string;
  signal_type_name: string;
  required_param_count: number;
  total_signals: number;
  complete_signals: number;
  completeness_rate: number;
}

export interface N28Data {
  metric: string;
  campaign_id: number;
  completeness_rate: number;
  completeness_display: string;
  total_signals: number;
  complete_signals: number;
  type_breakdown: N28TypeBreakdown[];
  computed_at: string;
}

export interface N28Params {
  campaign_id: string;
  signal_type_code?: string;
}
