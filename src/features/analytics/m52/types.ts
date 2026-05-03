export interface M52Data {
  metric: string;
  campaign_id: number;
  deployment_rate: number;
  active_devices: number;
  active_staff: number;
  days_lookback: number;
  computed_at: string;
}

export interface M52Params {
  campaign_id: string;
  days?: number;
}
