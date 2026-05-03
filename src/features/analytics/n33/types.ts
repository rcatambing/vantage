export interface N33CityClassBreakdown {
  city_class: string;
  avg_cwss: number;
  voter_count: number;
}

export interface N33Data {
  metric: string;
  campaign_id: number;
  province: string | null;
  overall_variance: number | null;
  city_class_breakdown: N33CityClassBreakdown[];
  computed_at: string;
}

export interface N33Params {
  campaign_id: string;
  province?: string;
}
