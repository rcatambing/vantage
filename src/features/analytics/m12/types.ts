export interface M12TaskProgress {
  task_id: string;
  task_title: string;
  total_milestones: number;
  completed_milestones: number;
  progress_percent: number;
}

export interface M12Data {
  metric_code: string;
  campaign_id: string | number;
  overall_progress_percent: number | null;
  total_milestones: number;
  completed_milestones: number;
  by_task: M12TaskProgress[];
  computed_at: string;
}

export interface M12Params {
  campaign_id: string;
  task_id?: string;
}
