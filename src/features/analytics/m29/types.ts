export interface M29StaffBreakdown {
  staff_id: number;
  staff_name: string;
  completed: number;
  total: number;
  rate: number;
}

export interface M29Data {
  metric: string;
  campaign_id: number;
  overall_rate: number | null;
  total_tasks: number;
  completed_tasks: number;
  staff_breakdown: M29StaffBreakdown[];
  computed_at: string;
}

export interface M29Params {
  campaign_id: string;
}
