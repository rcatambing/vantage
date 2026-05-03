export interface N31DistrictBreakdown {
  district_id: number;
  district_name: string;
  cwss: number;
  persuasion_velocity: number;
  leader_support: number;
  workforce_saturation: number;
  sla_risk: number;
  winnability_score: number;
}

export interface N31Data {
  metric: string;
  campaign_id: number;
  district_id: number | null;
  winnability_score: number;
  components: {
    cwss_weight: number;
    persuasion_velocity_weight: number;
    leader_support_weight: number;
    workforce_saturation_weight: number;
    sla_risk_weight: number;
  };
  district_breakdown: N31DistrictBreakdown[];
  computed_at: string;
}

export interface N31Params {
  campaign_id: string;
  district_id?: number;
}
