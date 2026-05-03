export interface M51DistrictBreakdown {
  district_id: number;
  district_name: string;
  district_type: string;
  staff_count: number;
  voter_count: number;
  ratio: number | null;
  ratio_display: string;
}

export interface M51Data {
  metric: string;
  campaign_id: number;
  overall_ratio: number | null;
  overall_display: string;
  total_staff: number;
  total_voters: number;
  district_breakdown: M51DistrictBreakdown[];
  computed_at: string;
}

export interface M51Params {
  campaign_id: string;
  district_id?: number;
}
