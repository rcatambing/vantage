export interface M28DistrictTypeBreakdown {
  district_type: string;
  covered: number;
  total: number;
  rate: number;
}

export interface M28Data {
  metric: string;
  campaign_id: number;
  district_type_filter: string | null;
  coverage_rate: number;
  covered_districts: number;
  total_districts: number;
  by_district_type: M28DistrictTypeBreakdown[];
  computed_at: string;
}

export interface M28Params {
  campaign_id: string;
  district_type?: string;
}
