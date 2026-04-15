// ─── Community Leader ────────────────────────────────────────────────────────

export type InfluenceLevel = "LOW" | "MEDIUM" | "HIGH" | "KEY_INFLUENCER";
export type SupportStatus =
  | "UNKNOWN"
  | "SUPPORTER"
  | "NEUTRAL"
  | "OPPONENT"
  | "UNDECIDED";
export type LeaderStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type EngagementEventType = "MEETING" | "COMMITMENT" | "ISSUE" | "NOTE";

export interface CommunityLeader {
  id: string;
  campaign_id: string;
  full_name: string;
  organization: string | null;
  affiliation: string | null;
  influence_level: InfluenceLevel;
  support_status: SupportStatus;
  status: LeaderStatus;
  district_id: string | null;
  district_name: string | null;
  relationship_owner_id: string | null;
  /** PII mask — raw contact never exposed in list */
  has_contact: boolean;
  /** sensitive — display with privacy indicator */
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface LeaderEngagementEvent {
  id: string;
  leader_id: string;
  event_type: EngagementEventType;
  description: string;
  occurred_at: string;
  recorded_by: string;
  recorded_by_name: string;
}

export interface LeaderCreatePayload {
  full_name: string;
  organization?: string;
  affiliation?: string;
  influence_level: InfluenceLevel;
  support_status?: SupportStatus;
  campaign_id: string;
  district_id?: string;
  relationship_owner_id?: string;
  notes?: string;
}

export interface LeaderUpdatePayload extends Partial<LeaderCreatePayload> {
  status?: LeaderStatus;
}

export interface AddEngagementPayload {
  event_type: EngagementEventType;
  description: string;
  /** ISO date; defaults to now server-side */
  occurred_at?: string;
}

export interface PaginatedLeaders {
  items: CommunityLeader[];
  total: number;
  page: number;
  page_size: number;
}

export interface LeadersQueryParams {
  campaign_id?: string;
  influence_level?: InfluenceLevel;
  support_status?: SupportStatus;
  district_id?: string;
  relationship_owner_id?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// ─── Customer Account ─────────────────────────────────────────────────────────

export type AccountStatus = "ACTIVE" | "INACTIVE" | "PROSPECT" | "CHURNED";
export type AccountSegment =
  | "ENTERPRISE"
  | "MID_MARKET"
  | "SMB"
  | "GOVERNMENT"
  | "NGO";

export interface AffiliationTypeRef {
  id: string;
  code: string;
  name: string;
}

export interface AffiliationRef {
  id: string;
  affiliation_type_id: string;
  code: string;
  name: string;
}

export interface SignalTypeRef {
  id: string;
  code: string;
  name: string;
}

export interface CustomerAccount {
  id: string;
  campaign_id: string;
  account_name: string;
  segment: AccountSegment | null;
  district_id: string | null;
  district_name: string | null;
  primary_contact_name: string | null;
  has_contact: boolean;
  status: AccountStatus;
  owner_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface AccountCreatePayload {
  account_name: string;
  campaign_id: string;
  segment?: AccountSegment;
  district_id?: string;
  primary_contact_name?: string;
  owner_id?: string;
  notes?: string;
}

export interface AccountUpdatePayload extends Partial<AccountCreatePayload> {
  status?: AccountStatus;
}

export interface PaginatedAccounts {
  items: CustomerAccount[];
  total: number;
  page: number;
  page_size: number;
}

export interface AccountsQueryParams {
  campaign_id?: string;
  segment?: AccountSegment;
  status?: AccountStatus;
  district_id?: string;
  owner_id?: string;
  search?: string;
  page?: number;
  page_size?: number;
  // Account intelligence filters (Epic 11)
  affiliation_type_id?: string;
  affiliation_id?: string;
  signal_type_id?: string;
}

// ─── Account Affiliations ─────────────────────────────────────────────────────

export interface AccountAffiliation {
  id: string;
  account_id: string;
  affiliation_id: string;
  /** resolved affiliation name — display only; not editable */
  affiliation_name: string;
  affiliation_type_id: string;
  affiliation_type_code: string;
  role_in_affiliation: string | null;
  /** 0–100 loyalty/alignment estimate */
  affinity_score: number | null;
  is_primary: boolean;
  start_date: string | null;
  end_date: string | null;
  source: string | null;
}

export interface AccountAffiliationCreatePayload {
  affiliation_id: string;
  role_in_affiliation?: string;
  affinity_score?: number;
  is_primary?: boolean;
  /** ISO date; open-ended if omitted */
  start_date?: string;
  source?: string;
}

export interface AccountAffiliationUpdatePayload {
  role_in_affiliation?: string;
  affinity_score?: number;
  is_primary?: boolean;
  /** ISO date; sets logical close when present */
  end_date?: string;
}

// ─── Account Signals ─────────────────────────────────────────────────────────

export interface AccountSignalParam {
  id: string;
  account_signal_id: string;
  param_key: string;
  param_value_text: string | null;
  param_value_number: number | null;
  param_value_bool: boolean | null;
  unit: string | null;
}

export type AccountSignalParamDraft =
  | { type: "text";   param_key: string; value: string;  unit?: string }
  | { type: "number"; param_key: string; value: number;  unit?: string }
  | { type: "bool";   param_key: string; value: boolean; unit?: string };

export interface AccountSignal {
  id: string;
  account_id: string;
  signal_type_id: string;
  signal_type_code: string;
  signal_type_name: string;
  /** non-null means this signal was auto-derived from an affiliation assignment */
  derived_from_affiliation_id: string | null;
  intensity_score: number | null;
  confidence_score: number | null;
  observed_at: string;
  expires_at: string | null;
  source: string | null;
  notes: string | null;
  params: AccountSignalParam[];
}

export interface PaginatedAccountSignals {
  items: AccountSignal[];
  total: number;
  page: number;
  page_size: number;
}

export interface AccountSignalCreatePayload {
  signal_type_id: string;
  intensity_score?: number;
  confidence_score?: number;
  observed_at: string;
  expires_at?: string;
  source?: string;
  notes?: string;
  params?: AccountSignalParamDraft[];
}

export interface AccountSignalUpdatePayload {
  intensity_score?: number;
  confidence_score?: number;
  expires_at?: string | null;
  notes?: string;
}
