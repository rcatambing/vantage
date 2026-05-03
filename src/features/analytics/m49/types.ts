export interface M49CategoryBreakdown {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilization_rate: number | null;
  utilization_display: string;
  spending_cap: number;
  currency: string;
  warning_threshold: number;
  over_budget: boolean;
  near_cap: boolean;
}

export interface M49Data {
  metric: string;
  campaign_id: number;
  overall_utilization: number | null;
  overall_display: string;
  total_allocated: number;
  total_spent: number;
  total_remaining: number;
  total_spending_cap: number;
  category_count: number;
  category_breakdown: M49CategoryBreakdown[];
  computed_at: string;
}

export interface M49Params {
  campaign_id: string;
  category?: string;
}
