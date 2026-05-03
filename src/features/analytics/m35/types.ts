export interface M35DistrictBreakdown {
  district_id: number;
  district_name: string;
  district_type: string;
  registered_voters: number;
  contacted_voters: number;
  penetration_rate: number | null;
  penetration_display: string;
}

export interface M35Data {
  metric: string;
  campaign_id: number;
  overall_penetration: number | null;
  overall_display: string;
  total_registered_voters: number;
  total_contacted_voters: number;
  district_breakdown: M35DistrictBreakdown[];
  computed_at: string;
}

export interface M35Params {
  campaign_id: string;
  district_id?: number;
  contact_type?: string;
}
