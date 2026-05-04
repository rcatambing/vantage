import { apiFetch } from "../../../lib/api/client";
import type { BatchJob, JobListResponse, ExecutionListResponse } from "../types";

const BASE = "/batch-jobs/definitions";
const EXEC_BASE = "/batch-jobs/executions";

export function fetchJobs(category?: string): Promise<JobListResponse> {
  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  qs.set("page_size", "100");
  const query = qs.toString();
  return apiFetch<JobListResponse>(`${BASE}?${query}`);
}

export function fetchJob(id: number): Promise<BatchJob> {
  return apiFetch<BatchJob>(`${BASE}/${id}`);
}

export function fetchExecutions(jobId: number): Promise<ExecutionListResponse> {
  const qs = new URLSearchParams();
  qs.set("job_definition_id", String(jobId));
  qs.set("page_size", "100");
  return apiFetch<ExecutionListResponse>(`${EXEC_BASE}?${qs.toString()}`);
}
