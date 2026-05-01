import type { TaskMilestone } from "../types";
import { apiFetch } from "../../../lib/api/client";
import { normalizeListResponse, type ListResponseWire } from "../../../lib/api/responseShape";

export function fetchMilestones(taskId: string): Promise<TaskMilestone[]> {
  return apiFetch<ListResponseWire<TaskMilestone>>(`/tasks/${taskId}/milestones`).then(
    normalizeListResponse
  );
}

export function createMilestone(
  taskId: string,
  data: { title: string }
): Promise<{ message: string; data: { id: number } }> {
  return apiFetch(`/tasks/${taskId}/milestones`, { method: "POST", body: JSON.stringify(data) });
}

export function updateMilestone(
  milestoneId: number,
  data: { title?: string; is_completed?: boolean }
): Promise<{ message: string }> {
  return apiFetch(`/milestones/${milestoneId}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteMilestone(milestoneId: number): Promise<{ message: string }> {
  return apiFetch(`/milestones/${milestoneId}`, { method: "DELETE" });
}
