export interface M23PollBreakdown {
  poll_id: number;
  poll_name: string;
  completed_count: number;
  total_sessions: number;
  completion_rate: number | null;
}

export interface M23Data {
  metric: string;
  campaign_id: number;
  poll_id: number | null;
  completion_rate: number | null;
  completed_count: number;
  total_sessions: number;
  polls: M23PollBreakdown[];
  computed_at: string;
}

export interface M23Params {
  campaign_id: string;
  poll_id?: number;
}
