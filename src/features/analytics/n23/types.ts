export interface N23DistrictBreakdown {
  district_id: number;
  district_name: string;
  total_contacts: number;
}

export interface N23Summary {
  total_contacts: number;
  converted_contacts: number;
  conversion_rate: number | null;
  conversion_rate_display: string;
}

export interface N23Data {
  metric: string;
  campaign_id: number;
  district_filter: number | null;
  computed_at: string;
  summary: N23Summary;
  district_breakdown: N23DistrictBreakdown[];
}

export interface N23Params {
  campaign_id: string;
  district_id?: number;
}
