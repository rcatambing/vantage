export interface M31EvaluationType {
  evaluation_type: string;
  avg: number | null;
  count: number;
}

export interface M31StaffBreakdown {
  staff_id: number;
  staff_name: string;
  overall_avg: number | null;
  total_evaluations: number;
  by_type: Record<string, number>;
}

export interface M31Data {
  metric: string;
  campaign_id: number;
  overall_avg: number | null;
  total_evaluations: number;
  by_evaluation_type: M31EvaluationType[];
  staff_breakdown: M31StaffBreakdown[];
  computed_at: string;
}

export interface M31Params {
  campaign_id: string;
}
