export type PhaseDirection = "AHEAD" | "ON_TIME" | "BEHIND" | "PENDING";

export interface M13Phase {
  phase: "start" | "completion";
  target_date: string | null;
  actual_date: string | null;
  variance_days: number | null;
  direction: PhaseDirection;
}

export interface M13Data {
  metric_code: string;
  campaign_id: string | number;
  campaign_name: string;
  campaign_status: string;
  metric: number | null;
  phases: M13Phase[];
  computed_at: string;
}

export interface M13Params {
  campaign_id: string;
}
