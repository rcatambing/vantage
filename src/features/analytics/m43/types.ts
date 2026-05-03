export interface M43DistrictBreakdown {
  district_id: number;
  district_name: string;
  district_type: string;
  houses_visited: number;
  houses_targeted: number;
  canvass_rate: number | null;
  canvass_rate_display: string;
  remaining: number;
}

export interface M43Data {
  metric: string;
  campaign_id: number;
  overall_canvass_rate: number | null;
  overall_display: string;
  total_houses_visited: number;
  total_houses_targeted: number;
  total_remaining: number;
  district_breakdown: M43DistrictBreakdown[];
  computed_at: string;
}

export interface M43Params {
  campaign_id: string;
  district_id?: number;
}
