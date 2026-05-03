export interface M20RankedIssue {
  rank: number;
  issue_text: string;
  count: number;
  share_pct: number;
}

export interface M20Pagination {
  skip: number;
  limit: number;
  total: number;
}

export interface M20Data {
  metric: string;
  campaign_id: number;
  poll_id: number | null;
  total_distinct_issues: number;
  total_responses_used: number;
  ranked_issues: M20RankedIssue[];
  pagination: M20Pagination;
  computed_at: string;
}

export interface M20Params {
  campaign_id: string;
  limit?: number;
}
