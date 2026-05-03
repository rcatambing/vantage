export interface M41DistrictBreakdown {
  district_id: number;
  district_name: string;
  district_type: string;
  target_voters: number;
  contacted_voters: number;
  contact_rate: number | null;
  contact_rate_display: string;
}

export interface M41Data {
  metric: string;
  campaign_id: number;
  overall_contact_rate: number | null;
  overall_display: string;
  total_target_voters: number;
  total_contacted_voters: number;
  district_breakdown: M41DistrictBreakdown[];
  computed_at: string;
}

export interface M41Params {
  campaign_id: string;
  district_id?: number;
  contact_type?: string;
}
