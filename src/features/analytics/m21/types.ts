export interface M21TrendBucket {
  bucket_start: string;
  avg_sentiment: number;
  response_count: number;
}

export interface M21Pagination {
  skip: number;
  limit: number;
  total: number;
}

export interface M21Data {
  metric: string;
  campaign_id: number;
  poll_id: number | null;
  bucket: string;
  trend: M21TrendBucket[];
  pagination: M21Pagination;
  computed_at: string;
}

export interface M21Params {
  campaign_id: string;
  bucket?: string;
}
