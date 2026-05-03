export interface N39CityClassBreakdown {
  city_class: string;
  turnout_factor: number;
  persuasion_factor: number;
  modifier: number;
  adjusted_winnability: number | null;
}

export interface N39Data {
  metric: string;
  campaign_id: number;
  province: string | null;
  city_class_breakdown: N39CityClassBreakdown[];
  computed_at: string;
}

export interface N39Params {
  campaign_id: string;
  province?: string;
}
