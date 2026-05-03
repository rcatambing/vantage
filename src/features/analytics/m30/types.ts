export interface M30StaffBreakdown {
  staff_id: number;
  staff_name: string;
  avg_rating: number | null;
  rated_count: number;
}

export interface M30Data {
  metric: string;
  campaign_id: number;
  overall_avg: number | null;
  rated_count: number;
  staff_breakdown: M30StaffBreakdown[];
  computed_at: string;
}

export interface M30Params {
  campaign_id: string;
}
