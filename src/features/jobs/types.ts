export interface BatchJob {
  id: number;
  name: string;
  description: string;
  job_class_path: string;
  category: string;
  is_scheduled: boolean;
  cron_expression: string | null;
  status: string;
  config: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface BatchJobExecution {
  id: number;
  job_definition_id: number;
  status: string;
  trigger_source: string;
  actor_id: number | null;
  started_at: string | null;
  ended_at: string | null;
  result_summary: Record<string, unknown> | null;
  error_detail: string | null;
}

export interface JobListResponse {
  items: BatchJob[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface ExecutionListResponse {
  items: BatchJobExecution[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
