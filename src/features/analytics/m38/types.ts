export interface M38GapEntry {
  district_id: number;
  district_name: string;
  district_type: string;
  province: string;
  city: string;
}

export interface M38Data {
  metric: string;
  campaign_id: number;
  gap_count: number;
  total_districts: number;
  gap_rate: number;
  gaps: M38GapEntry[];
  computed_at: string;
}

export interface M38Params {
  campaign_id: string;
}
