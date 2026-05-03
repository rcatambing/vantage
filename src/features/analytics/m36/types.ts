export interface M36BarangayEntry {
  district_id: number;
  district_name: string;
  support_index: number;
  poll_favorability: number;
  voter_count: number;
}

export interface M36Data {
  metric: string;
  campaign_id: number;
  barangay_scores: M36BarangayEntry[];
  computed_at: string;
}

export interface M36Params {
  campaign_id: string;
}
