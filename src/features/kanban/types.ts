// Kanban board types — mirrors backend models

export interface BoardUser {
  user_id: number;
  username: string;
  full_name: string;
}

export interface BoardMember {
  id: number;
  user_id: number;
  role: "OWNER" | "MEMBER";
  username: string;
  full_name: string;
}

export type TaskPriority = 0 | 1 | 2 | 3; // 0=none, 1=low, 2=medium, 3=high

export interface TaskMilestone {
  id: number;
  title: string;
  is_completed: boolean;
  task_id: string;
  created_at: string;
}

export interface TaskCommentEditEntry {
  content: string;
  edited_at: string;
}

export interface TaskComment {
  id: number;
  task_id: string;
  user_id: number;
  username: string;
  full_name: string;
  content: string;
  edit_history: TaskCommentEditEntry[] | null;
  created_at: string;
  updated_at: string | null;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string | null;
  priority: number;
  index: number;
  assignee_id: number | null;
  assignee: BoardUser | null;
  column_id: number;
  board_id: number;
  milestone_count: number;
  milestone_completed: number;
  progress_percent: number;
  created_at: string;
  ticket_type?: "TASK" | "INCIDENT" | "REQUEST" | null;
  severity?: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" | null;
  sla_breached?: boolean;
  sla_due_at?: string | null;
  objective_ids?: string[];
  campaign_task_id?: string | null;
  ticket_id?: string | null;
}

export interface BoardFilters {
  assignee_id?: string;
  severity?: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  ticket_type?: "TASK" | "INCIDENT" | "REQUEST";
  sla_breached?: boolean;
  due_before?: string;
}

export interface BoardColumn {
  id: number;
  title: string;
  order_index: number;
  tasks: KanbanTask[];
}

export interface Board {
  id: number;
  name: string;
  key: string;
  description: string | null;
  campaign_id: number | null;
  owner_id: number;
  owner: BoardUser;
  members: BoardMember[];
  columns: BoardColumn[];
  created_at: string;
  updated_at: string | null;
}

export interface BoardSummary {
  id: number;
  name: string;
  key: string;
  description: string | null;
  campaign_id: number | null;
  owner_id: number;
  owner_username: string;
  owner_full_name: string;
  created_at: string;
}
