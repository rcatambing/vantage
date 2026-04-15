import { apiFetch } from "../../../lib/api/client";
import type {
  Campaign,
  CampaignCreatePayload,
  Objective,
  DiagnosticsResponse,
  ObjectiveStatus,
} from "../types";

type CreateCampaignResponse = {
  message: string;
  data: { id: number; project_code: string };
};
type ActivateCampaignResponse = {
  message: string;
  id: number;
  project_code: string;
  actual_start: string;
};
type StatusUpdateResponse = { message: string; id: number };
type ActionResponse = { message: string; id: number };

export async function listCampaigns(): Promise<Campaign[]> {
  try {
    const data = await apiFetch<Campaign[] | Campaign>("/campaigns");
    return Array.isArray(data) ? data : [data];
  } catch (err) {
    // The backend returns HTTP 404 when the campaign list is empty.
    // Treat this as an empty result rather than a true error (backend quirk).
    if (err instanceof Error && /404|not found/i.test(err.message)) return [];
    throw err;
  }
}

export function getCampaign(id: number): Promise<Campaign> {
  return apiFetch<Campaign>(`/campaigns/${id}`);
}

export function createCampaign(
  payload: CampaignCreatePayload
): Promise<CreateCampaignResponse> {
  return apiFetch<CreateCampaignResponse>("/campaigns", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function activateCampaign(id: number): Promise<ActivateCampaignResponse> {
  return apiFetch<ActivateCampaignResponse>(`/campaigns/${id}/activate`, {
    method: "POST",
  });
}

export function holdCampaign(id: number): Promise<ActionResponse> {
  return apiFetch<ActionResponse>(`/campaigns/${id}/hold`, { method: "POST" });
}

export function cancelCampaign(id: number): Promise<ActionResponse> {
  return apiFetch<ActionResponse>(`/campaigns/${id}/cancel`, { method: "POST" });
}

export function completeCampaign(id: number): Promise<ActionResponse> {
  return apiFetch<ActionResponse>(`/campaigns/${id}/complete`, { method: "POST" });
}

export function deleteCampaign(id: number): Promise<StatusUpdateResponse> {
  return apiFetch<StatusUpdateResponse>(`/campaigns/${id}`, { method: "DELETE" });
}

export function getObjectives(campaignId: number): Promise<Objective[]> {
  return apiFetch<Objective[]>(`/campaigns/${campaignId}/objectives`);
}

export function getDiagnostics(campaignId: number): Promise<DiagnosticsResponse> {
  return apiFetch<DiagnosticsResponse>(`/campaigns/${campaignId}/diagnostics`);
}

export async function createObjective(data: {
  title: string;
  description?: string;
  campaign_id: number;
  priority?: number;
  target_date?: string;
}): Promise<any> {
  return apiFetch('/objectives', { method: 'POST', body: JSON.stringify(data) });
}

export function updateObjectiveStatus(
  objectiveId: number,
  status: ObjectiveStatus
): Promise<{ message: string; data: Objective }> {
  return apiFetch(`/objectives/${objectiveId}`, {
    method: "PUT",
    body: JSON.stringify({ objective_status: status }),
  });
}
