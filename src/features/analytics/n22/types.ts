export interface N22StaffBreakdown {
  staff_id: number;
  staff_code: string;
  assignment_count: number;
  completed_tasks: number;
  utilized: boolean;
}

export interface N22Data {
  metric: string;
  campaign_id: number;
  utilization_rate: number | null;
  utilization_display: string;
  total_primary_assignments: number;
  utilized_count: number;
  days_window: number;
  staff_breakdown: N22StaffBreakdown[];
  computed_at: string;
}

export interface N22Params {
  campaign_id: string;
  district_id?: number;
  days_window?: number;
}
