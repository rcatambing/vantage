import { apiFetch } from "./client";
import type {
  Team,
  TeamCreatePayload,
  TeamUpdatePayload,
  PaginatedResponse,
  CampaignRef,
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

/**
 * Fetches a compact list of campaigns for use in filter dropdowns.
 * Returns PaginatedResponse<CampaignRef> — adjust the response shape if
 * `GET /api/campaigns` returns a different envelope.
 */
export function getCampaigns(): Promise<PaginatedResponse<CampaignRef>> {
  return apiFetch("/campaigns?page_size=100");
}
