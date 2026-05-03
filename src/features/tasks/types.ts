export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "BLOCKED";
export type TaskPriority = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface CampaignTask {
  id: string;
  title: string;
  description: string | null;
  campaign_id: string;
  objective_ids: string[];
  assignee_id: string | null;
  assignee_team_id: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string | null;
  due_date: string | null;
  actual_completion: string | null;
  is_overdue: boolean;
  progress_percent: number;
  milestone_count: number;
  milestone_completed: number;
  created_at: string;
  updated_at: string | null;
}

export interface TaskMilestone {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  username: string;
  full_name: string;
  content: string;
  created_at: string;
  updated_at: string | null;
}

export interface CampaignTaskDetail extends CampaignTask {
  milestones: TaskMilestone[];
  comments: TaskComment[];
}

export interface PaginatedTasks {
  items: CampaignTask[];
  total: number;
  page: number;
  page_size: number;
}

export interface TasksQueryParams {
  campaign_id?: string;
  objective_id?: string;
  status?: TaskStatus;
  assignee_id?: string;
  is_overdue?: boolean;
  page?: number;
  page_size?: number;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  campaign_id: string;
  objective_ids?: string[];
  assignee_id?: string;
  assignee_team_id?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  start_date?: string;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  objective_ids?: string[];
  assignee_id?: string;
  assignee_team_id?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  start_date?: string;
}

export interface MilestoneCreatePayload {
  title: string;
}

export interface MilestoneUpdatePayload {
  title?: string;
  is_completed?: boolean;
}

export interface CommentCreatePayload {
  content: string;
}
