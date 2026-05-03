export interface M53SeverityBreakdown {
  severity: string;
  open_count: number;
}

export interface M53DistrictBreakdown {
  district_id: number;
  district_name: string;
  open_count: number;
}

export interface M53Data {
  metric: string;
  campaign_id: number;
  open_incidents: number;
  total_incidents: number;
  open_rate: number;
  open_rate_display: string;
  days_lookback: number;
  severity_breakdown: M53SeverityBreakdown[];
  district_breakdown: M53DistrictBreakdown[];
  computed_at: string;
}

export interface M53Params {
  campaign_id: string;
  days?: number;
}
