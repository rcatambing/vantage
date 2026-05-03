export interface M55SeverityBreakdown {
  severity: string;
  escalated_count: number;
}

export interface M55Data {
  metric: string;
  campaign_id: number;
  escalation_rate: number | null;
  escalation_display: string;
  total_tickets: number;
  escalated_count: number;
  critical_count: number;
  reassigned_count: number;
  days_lookback: number;
  severity_breakdown: M55SeverityBreakdown[];
  computed_at: string;
}

export interface M55Params {
  campaign_id: string;
  days?: number;
}
