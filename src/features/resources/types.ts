import { Intent } from "@blueprintjs/core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export type ResourceType =
  | "VEHICLE"
  | "EQUIPMENT"
  | "IT_ASSET"
  | "FURNITURE"
  | "SUPPLIES"
  | "COMMUNICATION"
  | "OTHER";

export type ResourceStatus =
  | "AVAILABLE"
  | "IN_USE"
  | "UNDER_MAINTENANCE"
  | "RESERVED"
  | "DECOMMISSIONED"
  | "DISPOSED";

export type ResourceCondition =
  | "NEW"
  | "EXCELLENT"
  | "GOOD"
  | "FAIR"
  | "POOR"
  | "NON_FUNCTIONAL";

// ─── Resource Entity ─────────────────────────────────────────────────────────

export interface Resource {
  id: string;
  resource_name: string;
  resource_code: string | null;
  resource_type: ResourceType;
  status: ResourceStatus;
  condition: ResourceCondition;
  description: string | null;
  specifications: Record<string, unknown>;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  acquisition_date: string | null;
  acquisition_cost: number | null;
  current_value: number | null;
  warranty_expiry: string | null;
  latitude: number | null;
  longitude: number | null;
  last_location_update: string | null;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  maintenance_notes: string | null;
  notes: string | null;
  tags: string[];
  current_assignment: ResourceAssignmentSummary | null;
  data_classification: string;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
}

// ─── Resource Assignment ─────────────────────────────────────────────────────

export interface ResourceAssignment {
  id: string;
  resource_id: string;
  resource_name: string;
  office_id: string;
  office_name: string;
  assigned_at: string;
  unassigned_at: string | null;
  assigned_by: string | null;
  assigned_by_name: string | null;
  unassigned_by: string | null;
  unassigned_by_name: string | null;
  from_office_id: string | null;
  from_office_name: string | null;
  notes: string | null;
}

export interface ResourceAssignmentSummary {
  id: string;
  office_id: string;
  office_name: string;
  assigned_at: string;
  assigned_by: string | null;
  assigned_by_name: string | null;
}

// ─── Payloads ────────────────────────────────────────────────────────────────

export interface ResourceCreatePayload {
  resource_name: string;
  resource_code?: string;
  resource_type: ResourceType;
  status?: ResourceStatus;
  condition?: ResourceCondition;
  description?: string;
  specifications?: Record<string, unknown>;
  brand?: string;
  model?: string;
  serial_number?: string;
  acquisition_date?: string;
  acquisition_cost?: number;
  current_value?: number;
  warranty_expiry?: string;
  latitude?: number;
  longitude?: number;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  maintenance_notes?: string;
  notes?: string;
  tags?: string[];
  data_classification?: string;
}

export interface ResourceUpdatePayload
  extends Partial<Omit<ResourceCreatePayload, "resource_type" | "resource_code">> {
  last_location_update?: string;
}

export interface ResourceAssignPayload {
  office_id: string;
  notes?: string;
}

export interface ResourceReassignPayload {
  target_office_id: string;
  notes?: string;
}

export interface ResourceUnassignPayload {
  notes?: string;
}

// ─── Query / Pagination ──────────────────────────────────────────────────────

export interface ResourcesQueryParams {
  resource_type?: ResourceType;
  status?: ResourceStatus;
  condition?: ResourceCondition;
  office_id?: string;
  unassigned?: boolean;
  tag?: string;
  search?: string;
  min_value?: number;
  max_value?: number;
  maintenance_due?: boolean;
  skip?: number;
  limit?: number;
}

export interface PaginatedResources {
  items: Resource[];
  total: number;
  skip: number;
  limit: number;
}

// ─── Display Helpers ─────────────────────────────────────────────────────────

export const RESOURCE_STATUS_INTENT: Record<ResourceStatus, Intent> = {
  AVAILABLE: Intent.SUCCESS,
  IN_USE: Intent.PRIMARY,
  UNDER_MAINTENANCE: Intent.WARNING,
  RESERVED: Intent.PRIMARY,
  DECOMMISSIONED: Intent.DANGER,
  DISPOSED: Intent.NONE,
};

export const RESOURCE_STATUS_LABEL: Record<ResourceStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  UNDER_MAINTENANCE: "Maintenance",
  RESERVED: "Reserved",
  DECOMMISSIONED: "Decommissioned",
  DISPOSED: "Disposed",
};

export const ACTIVE_RESOURCE_STATUSES: ResourceStatus[] = [
  "AVAILABLE",
  "IN_USE",
  "UNDER_MAINTENANCE",
  "RESERVED",
];

export const RESOURCE_TYPE_LABEL: Record<ResourceType, string> = {
  VEHICLE: "Vehicle",
  EQUIPMENT: "Equipment",
  IT_ASSET: "IT Asset",
  FURNITURE: "Furniture",
  SUPPLIES: "Supplies",
  COMMUNICATION: "Communication",
  OTHER: "Other",
};

export const RESOURCE_TYPE_ICON: Record<ResourceType, string> = {
  VEHICLE: "drive-time",
  EQUIPMENT: "wrench",
  IT_ASSET: "desktop",
  FURNITURE: "office",
  SUPPLIES: "box",
  COMMUNICATION: "phone",
  OTHER: "widget",
};

export const RESOURCE_CONDITION_INTENT: Record<ResourceCondition, Intent> = {
  NEW: Intent.SUCCESS,
  EXCELLENT: Intent.SUCCESS,
  GOOD: Intent.PRIMARY,
  FAIR: Intent.WARNING,
  POOR: Intent.DANGER,
  NON_FUNCTIONAL: Intent.DANGER,
};

export const RESOURCE_CONDITION_LABEL: Record<ResourceCondition, string> = {
  NEW: "New",
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
  NON_FUNCTIONAL: "Non-Functional",
};
