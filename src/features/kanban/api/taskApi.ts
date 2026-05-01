import { apiFetch } from "../../../lib/api/client";

export function createTask(data: {
  objective_id: number;
  title: string;
  description?: string;
  task_status?: string;
  priority?: number;
  index?: number;
  assignee_id?: number;
  column_id?: number;
  board_id?: number;
}): Promise<{ message: string; data: { id: string } }> {
  return apiFetch(`/tasks`, { method: "POST", body: JSON.stringify(data) });
}

export function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    task_status?: string;
    priority?: number;
    index?: number;
    assignee_id?: number | null;
  }
): Promise<{ message: string }> {
  return apiFetch(`/tasks/${taskId}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteTask(taskId: string): Promise<{ message: string }> {
  return apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
}

export function moveTask(
  taskId: string,
  data: { column_id: number; index: number }
): Promise<{ message: string }> {
  return apiFetch(`/tasks/${taskId}/move`, { method: "PUT", body: JSON.stringify(data) });
}
