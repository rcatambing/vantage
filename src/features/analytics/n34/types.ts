export interface N34CityClassBreakdown {
  city_class: string;
  persuadable_count: number;
  registered_count: number;
  density_per_1000: number;
}

export interface N34Data {
  metric: string;
  campaign_id: number;
  province: string | null;
  cwss_min: number;
  cwss_max: number;
  city_class_breakdown: N34CityClassBreakdown[];
  computed_at: string;
}

export interface N34Params {
  campaign_id: string;
  province?: string;
  cwss_range?: string;
}
