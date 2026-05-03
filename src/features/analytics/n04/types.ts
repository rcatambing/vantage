export interface N04DistrictBreakdown {
  district_id: number;
  district_name: string;
  total_voters: number;
  covered_voters: number;
  coverage: number | null;
  coverage_display: string;
}

export interface N04Data {
  metric: string;
  campaign_id: number;
  coverage: number | null;
  coverage_display: string;
  total_voters: number;
  covered_voters: number;
  district_breakdown: N04DistrictBreakdown[];
  computed_at: string;
}

export interface N04Params {
  campaign_id: string;
  affiliation_type?: string;
  district_id?: number;
}
