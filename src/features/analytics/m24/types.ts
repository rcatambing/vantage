export interface M24PollBreakdown {
  poll_id: number;
  poll_name: string;
  invited_count: number;
  responded_count: number;
  response_rate: number | null;
}

export interface M24Data {
  metric: string;
  campaign_id: number;
  poll_id: number | null;
  response_rate: number | null;
  invited_count: number;
  responded_count: number;
  polls: M24PollBreakdown[];
  computed_at: string;
}

export interface M24Params {
  campaign_id: string;
  poll_id?: number;
}
