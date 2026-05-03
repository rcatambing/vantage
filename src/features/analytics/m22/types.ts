export interface M22District {
  district_id: number;
  district_name: string;
  city: string;
  province: string;
  avg_sentiment: number | null;
  stddev_sentiment: number | null;
  response_count: number;
}

export interface M22Pagination {
  skip: number;
  limit: number;
  total: number;
}

export interface M22Data {
  metric: string;
  campaign_id: number;
  poll_id: number | null;
  district_type: string;
  districts: M22District[];
  unmapped_count: number;
  total_eligible_responses: number;
  pagination: M22Pagination;
  computed_at: string;
}

export interface M22Params {
  campaign_id: string;
}
