export interface M46MaterialBreakdown {
  material_type: string;
  quantity_produced: number;
  quantity_distributed: number;
  remaining: number;
  distribution_rate: number | null;
  distribution_display: string;
  production_cost: number;
  distribution_cost: number;
}

export interface M46Data {
  metric: string;
  campaign_id: number;
  overall_distribution_rate: number | null;
  overall_display: string;
  total_produced: number;
  total_distributed: number;
  total_remaining: number;
  total_production_cost: number;
  total_distribution_cost: number;
  material_count: number;
  material_breakdown: M46MaterialBreakdown[];
  computed_at: string;
}

export interface M46Params {
  campaign_id: string;
  district_id?: number;
  material_type?: string;
}
