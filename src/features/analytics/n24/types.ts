export interface N24ObjectiveBreakdown {
  objective_id: number;
  objective_title: string;
  total_done: number;
  cancelled_done: number;
  genuine_done: number;
  shock_rate: number;
}

export interface N24Data {
  metric: string;
  campaign_id: number;
  shock_rate: number;
  shock_display: string;
  total_done_tasks: number;
  cancelled_done_tasks: number;
  genuine_done_tasks: number;
  objective_breakdown: N24ObjectiveBreakdown[];
  computed_at: string;
}

export interface N24Params {
  campaign_id: string;
}
