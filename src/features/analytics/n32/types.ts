export interface N32DistrictBreakdown {
  district_id: number;
  district_name: string;
  severe_ticket_density: number;
  staffing_gap: number;
  expiring_signal_rate: number;
  reschedule_volatility: number;
  risk_score: number;
  flagged: boolean;
}

export interface N32Data {
  metric: string;
  campaign_id: number;
  district_id: number | null;
  risk_threshold: number;
  overall_risk: number;
  district_breakdown: N32DistrictBreakdown[];
  computed_at: string;
}

export interface N32Params {
  campaign_id: string;
  district_id?: number;
}
