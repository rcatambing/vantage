// Teams & Membership domain types — mirrors backend models/team.py

export type TeamStatus = "ACTIVE" | "DISSOLVED";
export type MemberRole = "TEAM_LEAD" | "MEMBER" | "OBSERVER";

export interface Team {
  id: string;
  team_name: string;
  description: string | null;
  status: TeamStatus;
  created_by: string | null;
  created_at: string;
  member_count: number;
}

export interface TeamCreatePayload {
  team_name: string;
  description?: string;
  /** Optional UUID — links team to this campaign immediately after creation */
  campaign_id?: string;
}

export interface TeamUpdatePayload {
  description?: string;
  status?: TeamStatus;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

/** Minimal campaign reference used in filter dropdowns and quick-link selects */
export interface CampaignRef {
  id: string;
  name: string;
}
