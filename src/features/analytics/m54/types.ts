export interface M54SeverityBreakdown {
  severity: string;
  total_with_sla: number;
  compliant: number;
  compliance_rate: number | null;
  compliance_display: string;
}

export interface M54BreachItem {
  ticket_id: number;
  title: string;
  severity: string;
  hours_over_sla: number;
  resolved_at: string | null;
  sla_due_at: string | null;
}

export interface M54Data {
  metric: string;
  campaign_id: number;
  compliance_rate: number | null;
  compliance_display: string;
  total_with_sla: number;
  compliant: number;
  breached: number;
  days_lookback: number;
  severity_breakdown: M54SeverityBreakdown[];
  breach_list: M54BreachItem[];
  computed_at: string;
}

export interface M54Params {
  campaign_id: string;
  severity?: string;
  days?: number;
}
