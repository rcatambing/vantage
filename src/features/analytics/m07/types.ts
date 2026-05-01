export type FallbackLevel =
  | "EXACT_CYCLE"
  | "PRIOR_CYCLE"
  | "PARENT_DISTRICT"
  | "NATIONAL_DEFAULT"
  | "NONE";

export type ConfidenceTier = "HIGH" | "MEDIUM" | "LOW";
export type AvailabilityStatus = "AVAILABLE" | "LOW_CONFIDENCE" | "UNAVAILABLE";
export type ElectionType = "NATIONAL" | "LOCAL" | "BARANGAY" | "SPECIAL";
export type TurnoutSource = "OFFICIAL" | "PARTNER" | "ANALYST_INPUT" | "ROLLED_UP";
export type DuplicateMode = "REJECT" | "UPSERT";
export type CommitMode = "VALIDATE_ONLY" | "COMMIT";
export type UploadStatus =
  | "UPLOADED"
  | "PARSED"
  | "VALIDATED"
  | "COMMITTED"
  | "FAILED"
  | "CANCELLED";

export interface M07ProvenanceMeta {
  source_mode: string;
  source_entities: string[];
  last_updated_at: string;
}

export interface M07EstimateItem {
  metric_code: string;
  district_id: string;
  turnout_estimate_rate: number | null;
  turnout_estimate_count: number | null;
  registered_voters: number;
  confidence_score: number;
  confidence_tier: ConfidenceTier;
  availability_status: AvailabilityStatus;
  fallback_level_used: FallbackLevel;
  historical_turnout_cycle_count: number;
  historical_turnout_last_cycle_year: number | null;
  historical_turnout_source: TurnoutSource | null;
  data_as_of: string;
  provenance_meta: M07ProvenanceMeta;
}

export interface M07EstimateMeta {
  applied_election_type: ElectionType;
  applied_election_cycle: number;
  available_cycles: number[];
}

export interface M07EstimateResponse {
  campaign_id: string;
  as_of: string;
  items: M07EstimateItem[];
  meta: M07EstimateMeta;
}

export interface M07EstimateParams {
  campaign_id: string;
  district_id?: string;
  election_type?: ElectionType;
  election_cycle?: number;
}

export interface M07HistoryItem {
  id: string;
  district_id: string;
  election_type: ElectionType;
  election_cycle_year: number;
  turnout_rate: number;
  turnout_count: number | null;
  registered_voters: number | null;
  quality_score: number | null;
  historical_turnout_source: TurnoutSource;
  source_scope: string;
  source_observed_at: string | null;
  upload_batch_id: string | null;
  revision_no: number;
  is_current: boolean;
  supersedes_record_id: string | null;
  revision_reason: string | null;
}

export interface M07HistoryResponse {
  campaign_id: string;
  items: M07HistoryItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface M07HistoryParams {
  campaign_id: string;
  district_id?: string;
  election_type?: ElectionType;
  year_from?: number;
  year_to?: number;
  page?: number;
  page_size?: number;
}

export interface M07UploadAccepted {
  message: string;
  batch_id: string;
  status: UploadStatus;
  commit_mode: CommitMode;
  counters_provisional: boolean;
}

export interface M07UploadBatch {
  batch_id: string;
  campaign_id: string;
  status: UploadStatus;
  file_name: string;
  duplicate_mode: DuplicateMode;
  commit_mode: CommitMode;
  total_rows: number;
  accepted_rows: number;
  rejected_rows: number;
  created_at: string;
  committed_at: string | null;
}

export interface M07UploadFileParams {
  campaign_id: string;
  file: File;
  idempotency_key: string;
  duplicate_mode: DuplicateMode;
  commit_mode: CommitMode;
}
