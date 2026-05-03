export interface M44EventBreakdown {
  activity_id: number;
  title: string;
  activity_type: string | null;
  status: string | null;
  district_id: number | null;
  district_name: string;
  venue: string | null;
  scheduled_at: string | null;
  expected_attendance: number;
  actual_attendance: number;
  voter_attendance: number;
  fulfillment_rate: number | null;
  fulfillment_display: string;
}

export interface M44TypeBreakdown {
  activity_type: string;
  event_count: number;
  expected_attendance: number;
  actual_attendance: number;
  fulfillment_rate: number | null;
  fulfillment_display: string;
}

export interface M44Data {
  metric: string;
  campaign_id: number;
  overall_fulfillment_rate: number | null;
  overall_display: string;
  total_expected_attendance: number;
  total_actual_attendance: number;
  event_count: number;
  event_breakdown: M44EventBreakdown[];
  type_breakdown: M44TypeBreakdown[];
  computed_at: string;
}

export interface M44Params {
  campaign_id: string;
  district_id?: number;
  activity_type?: string;
}
