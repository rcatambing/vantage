export interface M16Objective {
  objective_id: string | number;
  objective_title: string;
  objective_status: string;
  task_count: number;
}

export interface M16Data {
  metric_code: string;
  campaign_id: string | number;
  objective_count: number;
  task_count: number;
  ratio: number | null;
  objectives_with_no_tasks: number;
  by_objective: M16Objective[];
  computed_at: string;
}

export interface M16Params {
  campaign_id: string;
}
