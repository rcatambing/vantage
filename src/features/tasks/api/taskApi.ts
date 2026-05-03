import { apiFetch } from "../../../lib/api/client";
import type {
  CampaignTask,
  CampaignTaskDetail,
  PaginatedTasks,
  TasksQueryParams,
  TaskCreatePayload,
  TaskUpdatePayload,
  TaskMilestone,
  TaskComment,
  MilestoneCreatePayload,
  MilestoneUpdatePayload,
  CommentCreatePayload,
} from "../types";

// ---------------------------------------------------------------------------
// Query-string builder
// ---------------------------------------------------------------------------

function buildQS(
  params: Record<string, string | number | boolean | undefined | null | string[]>,
): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      v.forEach((item) => qs.append(k, String(item)));
    } else {
      qs.set(k, String(v));
    }
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

type PaginatedTasksWire = Partial<PaginatedTasks> & {
  data?: CampaignTask[];
};

function normalizePaginatedTasksResponse(
  res: PaginatedTasksWire | null,
): PaginatedTasks {
  if (!res || typeof res !== "object" || Array.isArray(res)) {
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: 0,
    };
  }

  const parsedTotal = Number(res.total);
  const parsedPage = Number(res.page);
  const parsedPageSize = Number(res.page_size);

  return {
    items: Array.isArray(res.items)
      ? res.items
      : Array.isArray(res.data)
        ? res.data
        : [],
    total: Number.isFinite(parsedTotal) ? parsedTotal : 0,
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    page_size: Number.isFinite(parsedPageSize) ? parsedPageSize : 0,
  };
}

// ---------------------------------------------------------------------------
// Task CRUD
// ---------------------------------------------------------------------------

export function listTasks(params: TasksQueryParams = {}): Promise<PaginatedTasks> {
  return apiFetch<PaginatedTasksWire>(
    `/tasks${buildQS(params as Record<string, string | number | boolean | undefined>)}`,
  ).then(normalizePaginatedTasksResponse);
}

export function getTask(id: string): Promise<CampaignTaskDetail> {
  return apiFetch<CampaignTaskDetail>(`/tasks/${id}`);
}

export function createTask(
  payload: TaskCreatePayload,
): Promise<{ message: string; data: CampaignTask }> {
  return apiFetch<{ message: string; data: CampaignTask }>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTask(
  id: string,
  payload: TaskUpdatePayload,
): Promise<{ message: string; data: CampaignTask }> {
  return apiFetch<{ message: string; data: CampaignTask }>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTask(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/tasks/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

export function listMilestones(taskId: string): Promise<TaskMilestone[]> {
  return apiFetch<TaskMilestone[]>(`/tasks/${taskId}/milestones`);
}

export function createMilestone(
  taskId: string,
  payload: MilestoneCreatePayload,
): Promise<TaskMilestone> {
  return apiFetch<TaskMilestone>(`/tasks/${taskId}/milestones`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateMilestone(
  id: string,
  payload: MilestoneUpdatePayload,
): Promise<TaskMilestone> {
  return apiFetch<TaskMilestone>(`/milestones/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteMilestone(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/milestones/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export function listComments(taskId: string): Promise<TaskComment[]> {
  return apiFetch<TaskComment[]>(`/tasks/${taskId}/comments`);
}

export function createComment(
  taskId: string,
  payload: CommentCreatePayload,
): Promise<TaskComment> {
  return apiFetch<TaskComment>(`/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
