export interface M11Task {
  task_id: string;
  task_title: string;
  assignee_name: string | null;
  due_date: string;
  days_overdue: number;
  priority: string | null;
  objective_title: string;
}

export interface M11Data {
  metric_code: string;
  campaign_id: string | number;
  overdue_rate_percent: number | null;
  overdue_count: number;
  active_task_count: number;
  unscheduled_task_count: number;
  tasks: M11Task[];
  computed_at: string;
}

export interface M11Params {
  campaign_id: string;
  objective_id?: string;
}
