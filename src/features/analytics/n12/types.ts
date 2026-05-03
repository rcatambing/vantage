export interface N12StatusBreakdown {
  outcome_status: string;
  count: number;
  percentage: number;
}

export interface N12LeaderBreakdown {
  leader_id: number;
  leader_name: string;
  influence_level: string;
  total_commitments: number;
  delivered: number;
  yield_rate: number;
}

export interface N12Data {
  metric: string;
  campaign_id: number;
  yield_rate: number | null;
  yield_display: string;
  total_commitments: number;
  delivered_count: number;
  pending_count: number;
  not_delivered_count: number;
  status_breakdown: N12StatusBreakdown[];
  leader_breakdown: N12LeaderBreakdown[];
  lookback_days: number;
  computed_at: string;
}

export interface N12Params {
  campaign_id: string;
  district_id?: number;
  influence_level?: string;
  days?: number;
}
