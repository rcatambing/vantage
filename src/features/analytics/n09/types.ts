export interface N09LevelBreakdown {
  influence_level: string;
  engaged: number;
  converted: number;
  conversion_rate: number | null;
  conversion_display: string;
}

export interface N09Data {
  metric: string;
  campaign_id: number;
  conversion_rate: number | null;
  conversion_display: string;
  total_engaged: number;
  converted_count: number;
  days_lookback: number;
  level_breakdown: N09LevelBreakdown[];
  computed_at: string;
}

export interface N09Params {
  campaign_id: string;
  district_id?: number;
  influence_level?: string;
  days?: number;
}
