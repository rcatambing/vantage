export interface M26TrendEntry {
  poll_id: number;
  poll_name: string;
  start_at: string | null;
  our_share_pct: number | null;
  opponent_share_pct: number | null;
  margin: number | null;
  margin_of_error: number | null;
  lower_bound: number | null;
  upper_bound: number | null;
  sample_size: number | null;
  design_effect: string | null;
}

export interface M26Data {
  metric: string;
  campaign_id: number;
  poll_id: number | null;
  our_candidate: string;
  opponent_candidate: string;
  confidence_level: number;
  our_share_pct: number | null;
  opponent_share_pct: number | null;
  margin: number | null;
  margin_of_error: number | null;
  lower_bound: number | null;
  upper_bound: number | null;
  sample_size: number | null;
  design_effect: string | null;
  trend: M26TrendEntry[];
  computed_at: string;
}

export interface M26Params {
  campaign_id: string;
  poll_id?: number;
  our_candidate: string;
  opponent_candidate: string;
  confidence_level?: number;
}
