import type { TaskComment } from "../types";
import { apiFetch } from "../../../lib/api/client";
import { normalizeListResponse, type ListResponseWire } from "../../../lib/api/responseShape";

export function fetchComments(taskId: string): Promise<TaskComment[]> {
  return apiFetch<ListResponseWire<TaskComment>>(`/tasks/${taskId}/comments`).then(
    normalizeListResponse
  );
}

export function createComment(
  taskId: string,
  data: { user_id: number; content: string }
): Promise<{ message: string; data: { id: number } }> {
  return apiFetch(`/tasks/${taskId}/comments`, { method: "POST", body: JSON.stringify(data) });
}

export function updateComment(
  commentId: number,
  data: { content: string }
): Promise<{ message: string }> {
  return apiFetch(`/task-comments/${commentId}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteComment(commentId: number): Promise<{ message: string }> {
  return apiFetch(`/task-comments/${commentId}`, { method: "DELETE" });
}
