export interface M25Ranking {
  candidate: string;
  count: number;
  share_pct: number | null;
}

export interface M25Data {
  metric: string;
  campaign_id: number;
  poll_id: number | null;
  our_candidate: string;
  candidates_filter: string[] | null;
  our_share_pct: number | null;
  our_count: number;
  total_responses: number;
  rankings: M25Ranking[];
  computed_at: string;
}

export interface M25Params {
  campaign_id: string;
  poll_id?: number;
  our_candidate: string;
  candidates?: string;
}
