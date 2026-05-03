export interface M40ComponentFlags {
  has_staff: boolean;
  has_intel: boolean;
  has_poll: boolean;
  has_leader: boolean;
}

export interface M40DistrictEntry {
  district_id: number;
  district_name: string;
  score: number;
  component_flags: M40ComponentFlags;
}

export interface M40Data {
  metric: string;
  campaign_id: number;
  readiness_breakdown: M40DistrictEntry[];
  computed_at: string;
}

export interface M40Params {
  campaign_id: string;
}
