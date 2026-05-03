export interface M27StaffTypeBreakdown {
  staff_type: string;
  total: number;
  active: number;
  inactive: number;
}

export interface M27Data {
  metric: string;
  campaign_id: number;
  include_inactive: boolean;
  total_count: number;
  active_count: number;
  inactive_count: number;
  by_staff_type: M27StaffTypeBreakdown[];
  computed_at: string;
}

export interface M27Params {
  campaign_id: string;
  include_inactive?: boolean;
}
