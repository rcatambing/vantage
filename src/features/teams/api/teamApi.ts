import { apiFetch } from "./client";
import type {
  Team,
  TeamCreatePayload,
  TeamUpdatePayload,
  PaginatedResponse,
  CampaignRef,
  TeamMember,
  StaffProfile,
} from "../types";

export interface TeamsQueryParams {
  campaign_id?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export function getTeams(
  params: TeamsQueryParams = {}
): Promise<PaginatedResponse<Team>> {
  const qs = new URLSearchParams();
  if (params.campaign_id) qs.set("campaign_id", params.campaign_id);
  if (params.status) qs.set("status", params.status);
  if (params.page != null) qs.set("page", String(params.page));
  if (params.page_size != null) qs.set("page_size", String(params.page_size));
  const query = qs.toString();
  return apiFetch(`/teams${query ? `?${query}` : ""}`);
}

export function getTeam(teamId: string): Promise<Team> {
  return apiFetch(`/teams/${teamId}`);
}

export function createTeam(
  payload: TeamCreatePayload
): Promise<{ message: string; data: Team }> {
  return apiFetch("/teams", { method: "POST", body: JSON.stringify(payload) });
}

export function updateTeam(
  teamId: string,
  payload: TeamUpdatePayload
): Promise<{ message: string; data: Team }> {
  return apiFetch(`/teams/${teamId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  return apiFetch(`/teams/${teamId}/members`);
}

export function addTeamMember(
  teamId: string,
  payload: { user_id: string; role: string }
): Promise<{ message: string; data: TeamMember }> {
  return apiFetch(`/teams/${teamId}/members`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function removeTeamMember(
  teamId: string,
  userId: string
): Promise<{ message: string }> {
  return apiFetch(`/teams/${teamId}/members/${userId}`, {
    method: "DELETE",
  });
}

export interface StaffQueryParams {
  team_id?: string;
  role?: string;
  staff_type?: string;
  status?: string;
  district?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export function getStaffList(
  params: StaffQueryParams = {}
): Promise<PaginatedResponse<StaffProfile>> {
  const qs = new URLSearchParams();
  if (params.team_id) qs.set("team_id", params.team_id);
  if (params.role) qs.set("role", params.role);
  if (params.staff_type) qs.set("staff_type", params.staff_type);
  if (params.status) qs.set("status", params.status);
  if (params.district) qs.set("district", params.district);
  if (params.search) qs.set("search", params.search);
  if (params.page != null) qs.set("page", String(params.page));
  if (params.page_size != null) qs.set("page_size", String(params.page_size));
  const query = qs.toString();
  return apiFetch(`/staff${query ? `?${query}` : ""}`);
}

export function getStaffProfile(userId: string): Promise<StaffProfile> {
  return apiFetch(`/staff/${userId}`);
}

/**
 * Fetches a compact list of campaigns for use in filter dropdowns.
 * Returns PaginatedResponse<CampaignRef> — adjust the response shape if
 * `GET /api/campaigns` returns a different envelope.
 */
export function getCampaigns(): Promise<PaginatedResponse<CampaignRef>> {
  return apiFetch("/campaigns?page_size=100");
}
