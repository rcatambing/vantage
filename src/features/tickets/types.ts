import { Intent } from "@blueprintjs/core";

// ── Ticket domain types ─────────────────────────────────────────────────────

export type TicketType = "TASK" | "INCIDENT" | "REQUEST";
export type TicketSeverity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type TicketStatus =
  | "DRAFT"
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "ON_HOLD";
export type TicketRelationshipKind =
  | "DEPENDS"
  | "DUPLICATES"
  | "RELATES_TO"
  | "CLONES";
export type GeoPrecision = "EXACT" | "BLOCK_LEVEL" | "DISTRICT_LEVEL";

// Campaign lifecycle states required for gating (BR-212)
export type CampaignStatus =
  | "PLANNED"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

// User roles exposed to the UI for gate rendering (BR-212, BR-015)
export type UserRole =
  | "OBSERVER"
  | "MEMBER"
  | "TEAM_LEAD"
  | "POLITICAL_OFFICER"
  | "SUPERVISOR"
  | "MANAGER"
  | "ADMIN";

// ── Service Location ────────────────────────────────────────────────────────

export interface TicketServiceLocation {
  country_code: string | null;
  region: string | null;
  province_state: string | null;
  city_municipality: string | null;
  barangay_or_district: string | null;
  postal_code: string | null;
  full_address: string | null;
  landmark: string | null;
  location_notes: string | null;
  latitude: number | null;
  longitude: number | null;
  geo_precision: GeoPrecision | null;
  verified_at: string | null;
  verified_by: string | null;
}

export interface TicketLocationHistoryEntry {
  id: string;
  ticket_id: string;
  changed_by: string;
  changed_at: string;
  change_reason: string;
  changed_fields: string[];
  old_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
}

// ── Ticket summaries & details ──────────────────────────────────────────────

export interface TicketSummary {
  id: string;
  ticket_number: string;
  title: string;
  ticket_type: TicketType;
  severity: TicketSeverity;
  status: TicketStatus;
  campaign_id: string;
  objective_id: string | null;
  owner_id: string;
  assignee_id: string | null;
  assignee_team_id: string | null;
  due_date: string | null;
  sla_due_at: string | null;
  sla_breached: boolean;
  has_location: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface TicketRelationship {
  id: string;
  kind: TicketRelationshipKind;
  related_ticket_id: string;
  related_ticket_number: string;
  related_ticket_title: string;
}

export interface ReassignmentEntry {
  id: string;
  from_user_id: string | null;
  to_user_id: string | null;
  from_team_id: string | null;
  to_team_id: string | null;
  reassigned_at: string;
  reassigned_by: string;
}

export interface Ticket extends TicketSummary {
  description: string | null;
  relationships: TicketRelationship[];
  reassignment_history: ReassignmentEntry[];
  location_history: TicketLocationHistoryEntry[];
}

// ── Payloads ────────────────────────────────────────────────────────────────

export interface TicketCreatePayload {
  title: string;
  description?: string;
  ticket_type: TicketType;
  severity: TicketSeverity;
  campaign_id: string;
  objective_id?: string;
  assignee_id?: string;
  assignee_team_id?: string;
  due_date?: string;
  service_location?: Partial<TicketServiceLocation>;
}

export interface TicketUpdatePayload {
  title?: string;
  description?: string;
  severity?: TicketSeverity;
  status?: TicketStatus;
  objective_id?: string;
  assignee_id?: string;
  assignee_team_id?: string;
  due_date?: string;
  service_location?: Partial<TicketServiceLocation>;
  change_reason?: string;
}

// ── Query & pagination ──────────────────────────────────────────────────────

export interface PaginatedTickets {
  items: TicketSummary[];
  total: number;
  page: number;
  page_size: number;
}

export interface TicketsQueryParams {
  campaign_id?: string;
  status?: TicketStatus;
  ticket_type?: TicketType;
  severity?: TicketSeverity;
  assignee_id?: string;
  sla_breached?: boolean;
  has_location?: boolean;
  city_municipality?: string;
  barangay_or_district?: string;
  geo_precision?: GeoPrecision;
  center_lat?: number;
  center_lng?: number;
  radius_km?: number;
  page?: number;
  page_size?: number;
}

// ── API error shapes ────────────────────────────────────────────────────────

export interface ApiErrorDetail {
  code: string;
  message: string;
  detail?: Record<string, unknown>;
}

export interface ApiValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// ── Display helpers ─────────────────────────────────────────────────────────

export const TICKET_STATUS_INTENT: Record<TicketStatus, Intent> = {
  DRAFT: Intent.NONE,
  OPEN: Intent.PRIMARY,
  IN_PROGRESS: Intent.WARNING,
  COMPLETED: Intent.SUCCESS,
  CANCELLED: Intent.NONE,
  ON_HOLD: Intent.WARNING,
};

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ON_HOLD: "On Hold",
};

export const TICKET_SEVERITY_INTENT: Record<TicketSeverity, Intent> = {
  LOW: Intent.NONE,
  MODERATE: Intent.PRIMARY,
  HIGH: Intent.WARNING,
  CRITICAL: Intent.DANGER,
};

export const TICKET_SEVERITY_LABEL: Record<TicketSeverity, string> = {
  LOW: "Low",
  MODERATE: "Moderate",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const TICKET_TYPE_LABEL: Record<TicketType, string> = {
  TASK: "Task",
  INCIDENT: "Incident",
  REQUEST: "Request",
};
