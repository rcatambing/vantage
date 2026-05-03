export interface N03DistrictBreakdown {
  district_id: number;
  district_name: string;
  active: number;
  expiring: number;
  expired: number;
  safe: number;
  expiry_risk: number | null;
  expiry_display: string;
}

export interface N03Data {
  metric: string;
  campaign_id: number;
  expiry_risk: number | null;
  expiry_display: string;
  total_active_signals: number;
  expiring_count: number;
  expired_count: number;
  safe_count: number;
  days_threshold: number;
  district_breakdown: N03DistrictBreakdown[];
  computed_at: string;
}

export interface N03Params {
  campaign_id: string;
  district_id?: number;
  days_threshold?: number;
}
