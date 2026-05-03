export type PersuasionStage =
  | "STRONG_SUPPORTER"
  | "LEAN_SUPPORTER"
  | "PERSUADABLE"
  | "LEAN_OPPONENT"
  | "STRONG_OPPONENT"
  | "UNKNOWN";

export interface VoterCompositeRow {
  voter_id: string;
  campaign_id: string;
  district_id: string | null;
  cwss: number;
  support_index: number;
  freshness_index: number;
  persuasion_stage: PersuasionStage;
  stage_confidence: number | null;
  contacts_30d: number;
  source_mode: string;
  computed_at: string;
}

export interface PersuasionFunnelRow {
  snapshot_date: string;
  campaign_id: string;
  district_id: string;
  persuasion_stage: PersuasionStage;
  voters_in_stage: number;
  stage_pct: number;
}

export interface DistrictReadinessRow {
  campaign_id: string;
  district_id: string;
  registered_voters: number;
  signal_coverage_pct: number;
  affiliation_coverage_pct: number;
  leader_presence_pct: number;
  poll_participation_coverage_pct: number;
  readiness_score: number;
  computed_at: string;
}

export interface SocioeconomicSummaryRow {
  campaign_id: string;
  district_id: string;
  city_class: string | null;
  income_bracket: string | null;
  voter_count: number;
  avg_cwss: number | null;
  avg_freshness_index: number | null;
  last_computed_at: string | null;
}

export type PagedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
};
