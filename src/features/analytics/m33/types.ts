export interface M33DistrictEntry {
  district_id: number;
  district_name: string;
  district_type: string;
  active_staff_count: number;
  total_assigned_count: number;
  utilization_rate: number;
}

export interface M33Data {
  metric: string;
  campaign_id: number;
  utilization_rate: number;
  active_staff_count: number;
  total_assigned_count: number;
  per_district: M33DistrictEntry[];
  computed_at: string;
}

export interface M33Params {
  campaign_id: string;
}
