export interface N21BarangayBreakdown {
  district_id: number;
  barangay_name: string;
  city: string | null;
  staff_count: number;
  voter_count: number;
  saturation: number;
  status: string;
}

export interface N21Data {
  metric: string;
  campaign_id: number;
  overall_saturation: number;
  total_staff: number;
  total_voters: number;
  barangay_count: number;
  barangay_breakdown: N21BarangayBreakdown[];
  computed_at: string;
}

export interface N21Params {
  campaign_id: string;
  district_id?: number;
}
