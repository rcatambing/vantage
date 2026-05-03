export interface N25SeverityBreakdown {
  severity: string;
  breach_count: number;
  median_hours: number;
  max_hours: number;
}

export interface N25Data {
  metric: string;
  campaign_id: number;
  breach_count: number;
  median_hours: number | null;
  p75_hours: number | null;
  p90_hours: number | null;
  severity_breakdown: N25SeverityBreakdown[];
  computed_at: string;
}

export interface N25Params {
  campaign_id: string;
  severity?: string;
}
