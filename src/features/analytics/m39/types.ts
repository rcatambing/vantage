export interface M39DistrictEntry {
  district_id: number;
  district_name: string;
  density: number;
  anecdote_count: number;
  voter_count: number;
}

export interface M39Data {
  metric: string;
  campaign_id: number;
  overall_density: number;
  district_breakdown: M39DistrictEntry[];
  computed_at: string;
}

export interface M39Params {
  campaign_id: string;
}
