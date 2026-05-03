import { apiFetch } from "../../../lib/api/client";
import type {
  VoterCompositeRow,
  PersuasionFunnelRow,
  DistrictReadinessRow,
  SocioeconomicSummaryRow,
  PagedResponse,
} from "../types";

export function listVoterComposites(
  campaignId: string,
  params: {
    district_id?: string;
    persuasion_stage?: string;
    min_cwss?: number;
    max_cwss?: number;
    min_freshness?: number;
    page?: number;
    page_size?: number;
  } = {},
) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) qs.set(k, String(v));
  });
  return apiFetch<PagedResponse<VoterCompositeRow>>(
    `/campaigns/${campaignId}/intelligence/voter-composites?${qs}`,
  );
}

export function getPersuasionFunnel(
  campaignId: string,
  params: { snapshot_date?: string; district_id?: string } = {},
) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) qs.set(k, String(v));
  });
  return apiFetch<PersuasionFunnelRow[]>(
    `/campaigns/${campaignId}/intelligence/persuasion-funnel?${qs}`,
  );
}

export function listDistrictReadiness(
  campaignId: string,
  params: { district_id?: string; min_readiness_score?: number } = {},
) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) qs.set(k, String(v));
  });
  return apiFetch<DistrictReadinessRow[]>(
    `/campaigns/${campaignId}/intelligence/district-readiness?${qs}`,
  );
}

export function listSocioeconomicSummary(
  campaignId: string,
  params: {
    district_id?: string;
    city_class?: string;
    income_bracket?: string;
    page?: number;
    page_size?: number;
  } = {},
) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) qs.set(k, String(v));
  });
  return apiFetch<PagedResponse<SocioeconomicSummaryRow>>(
    `/campaigns/${campaignId}/intelligence/socioeconomic-summary?${qs}`,
  );
}
