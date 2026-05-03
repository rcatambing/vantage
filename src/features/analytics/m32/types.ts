export interface M32StaffBreakdown {
  staff_id: number;
  staff_name: string;
  submission_count: number;
}

export interface M32Data {
  metric: string;
  campaign_id: number;
  total_submissions: number;
  staff_count: number;
  avg_per_staff: number;
  staff_breakdown: M32StaffBreakdown[];
  computed_at: string;
}

export interface M32Params {
  campaign_id: string;
}
