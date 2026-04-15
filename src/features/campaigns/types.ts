import { Intent } from "@blueprintjs/core";

export type CampaignStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
export type CampaignType = "ELECTION" | "OPERATIONS" | "SPECIAL_PROJECT";
export type ObjectiveStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "BLOCKED"
  | "CANCELLED";

export interface Campaign {
  id: number;
  name: string;
  project_code: string;
  campaign_type: CampaignType;
  campaign_status: CampaignStatus;
  description: string | null;
  target_start: string | null;
  target_completion: string | null;
  actual_start: string | null;
  actual_completion: string | null;
  created_at: string;
}

export interface Objective {
  id: number;
  objective_code: string | null;
  title: string;
  description: string | null;
  objective_status: ObjectiveStatus;
  campaign_id: number;
  created_at: string | null;
  updated_at: string | null;
  /** 0–100, derived server-side from task completions (BR-023) */
  progress: number;
  task_count: number;
  completed_task_count: number;
  /** True when the objective has no tasks assigned (BR-024) */
  is_orphan: boolean;
}

export interface DiagnosticsResponse {
  campaign_id: number;
  project_code: string;
  campaign_status: CampaignStatus;
  objective_count: number;
  total_tasks: number;
  completed_tasks: number;
  overall_progress: number;
  orphan_objectives: Array<{ id: number; title: string; status: string }>;
  stale_objectives: Array<{ id: number; title: string }>;
  objectives: Objective[];
}

export interface CampaignCreatePayload {
  name: string;
  description: string;
  campaign_type: CampaignType;
  target_start: string;
  target_completion: string;
}

/** BR-008: Maps each status to a Blueprint Intent for Tag coloring */
export const CAMPAIGN_STATUS_INTENT: Record<CampaignStatus, Intent> = {
  PLANNED: Intent.NONE,
  ACTIVE: Intent.SUCCESS,
  COMPLETED: Intent.PRIMARY,
  ON_HOLD: Intent.WARNING,
  CANCELLED: Intent.DANGER,
};

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  PLANNED: "Planned",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

export const CAMPAIGN_TYPE_LABEL: Record<CampaignType, string> = {
  ELECTION: "Election",
  OPERATIONS: "Operations",
  SPECIAL_PROJECT: "Special Project",
};

export const OBJECTIVE_STATUS_INTENT: Record<ObjectiveStatus, Intent> = {
  NOT_STARTED: Intent.NONE,
  IN_PROGRESS: Intent.PRIMARY,
  COMPLETED: Intent.SUCCESS,
  BLOCKED: Intent.DANGER,
  CANCELLED: Intent.NONE,
};

export const OBJECTIVE_STATUS_LABEL: Record<ObjectiveStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  BLOCKED: "Blocked",
  CANCELLED: "Cancelled",
};
