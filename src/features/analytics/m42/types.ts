export interface M42DistrictBreakdown {
  district_id: number;
  district_name: string;
  district_type: string;
  total_contact_events: number;
  unique_voters_contacted: number;
  touchpoints_per_voter: number | null;
  touchpoints_display: string;
}

export interface M42Data {
  metric: string;
  campaign_id: number;
  overall_touchpoints_per_voter: number | null;
  overall_display: string;
  total_contact_events: number;
  total_unique_voters: number;
  district_breakdown: M42DistrictBreakdown[];
  computed_at: string;
}

export interface M42Params {
  campaign_id: string;
  district_id?: number;
  contact_type?: string;
}
