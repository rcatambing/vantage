export interface M34StaffTypeEntry {
  staff_type: string;
  active_count: number;
  total_count: number;
  retention_rate: number;
}

export interface M34Data {
  metric: string;
  campaign_id: number;
  retention_rate: number;
  active_count: number;
  total_count: number;
  by_staff_type: M34StaffTypeEntry[];
  computed_at: string;
}

export interface M34Params {
  campaign_id: string;
}
