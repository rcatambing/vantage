import { Intent } from "@blueprintjs/core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export type OfficeType =
  | "HQ"
  | "FIELD_OFFICE"
  | "BRANCH"
  | "SATELLITE"
  | "WAREHOUSE"
  | "CONTACT_POINT"
  | "OTHER";

export type OfficeStatus =
  | "PLANNED"
  | "ACTIVE"
  | "TEMPORARY"
  | "INACTIVE"
  | "CLOSED"
  | "ARCHIVED";

export type ContactChannelType =
  | "PHONE"
  | "MOBILE"
  | "EMAIL"
  | "WEBSITE"
  | "FACEBOOK"
  | "X_TWITTER"
  | "INSTAGRAM"
  | "TIKTOK"
  | "OTHER";

// ─── Office Entity ───────────────────────────────────────────────────────────

export interface Office {
  id: string;
  office_name: string;
  office_code: string | null;
  office_type: OfficeType;
  status: OfficeStatus;
  description: string | null;
  capabilities: string[];
  district_id: string | null;
  district_name: string | null;
  manager_id: string | null;
  manager_name: string | null;
  street_address: string | null;
  barangay: string | null;
  city_municipality: string | null;
  province: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  contacts: OfficeContact[];
  operating_hours: string | null;
  capacity: number | null;
  notes: string | null;
  opened_date: string | null;
  closed_date: string | null;
  data_classification: string;
  staff_count: number;
  resource_count: number;
  campaign_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface OfficeContact {
  id: string;
  office_id: string;
  contact_type: ContactChannelType;
  value: string;
  label: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
}

export interface CampaignOfficeLink {
  id: string;
  campaign_id: string;
  campaign_name: string;
  office_id: string;
  is_primary_hq: boolean;
  linked_at: string;
  linked_by: string | null;
  notes: string | null;
}

export interface OfficeStaffAssignment {
  id: string;
  office_id: string;
  user_id: string;
  user_name: string;
  role: string | null;
  assigned_at: string;
  removed_at: string | null;
  assigned_by: string | null;
}

// ─── Payloads ────────────────────────────────────────────────────────────────

export interface OfficeCreatePayload {
  office_name: string;
  office_code?: string;
  office_type: OfficeType;
  status?: OfficeStatus;
  description?: string;
  capabilities?: string[];
  district_id?: string;
  manager_id?: string;
  street_address?: string;
  barangay?: string;
  city_municipality?: string;
  province?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  operating_hours?: string;
  capacity?: number;
  notes?: string;
  opened_date?: string;
  data_classification?: string;
}

export interface OfficeUpdatePayload
  extends Partial<Omit<OfficeCreatePayload, "office_type" | "office_code">> {
  closed_date?: string;
}

export interface ContactCreatePayload {
  contact_type: ContactChannelType;
  value: string;
  label?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface ContactUpdatePayload extends Partial<ContactCreatePayload> {}

export interface CampaignOfficeLinkPayload {
  campaign_id: string;
  is_primary_hq?: boolean;
  notes?: string;
}

export interface StaffAssignPayload {
  user_id: string;
  role?: string;
}

export interface StaffRoleUpdatePayload {
  role?: string;
}

export interface OfficesQueryParams {
  status?: OfficeStatus;
  office_type?: OfficeType;
  district_id?: string;
  manager_id?: string;
  capability?: string;
  province?: string;
  city?: string;
  campaign_id?: string;
  search?: string;
  skip?: number;
  limit?: number;
}

export interface PaginatedOffices {
  items: Office[];
  total: number;
  skip: number;
  limit: number;
}

// ─── Display Helpers ─────────────────────────────────────────────────────────

export const OFFICE_STATUS_INTENT: Record<OfficeStatus, Intent> = {
  PLANNED: Intent.PRIMARY,
  ACTIVE: Intent.SUCCESS,
  TEMPORARY: Intent.WARNING,
  INACTIVE: Intent.WARNING,
  CLOSED: Intent.DANGER,
  ARCHIVED: Intent.NONE,
};

export const OFFICE_STATUS_LABEL: Record<OfficeStatus, string> = {
  PLANNED: "Planned",
  ACTIVE: "Active",
  TEMPORARY: "Temporary",
  INACTIVE: "Inactive",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};

export const OFFICE_TYPE_LABEL: Record<OfficeType, string> = {
  HQ: "Headquarters",
  FIELD_OFFICE: "Field Office",
  BRANCH: "Branch",
  SATELLITE: "Satellite Site",
  WAREHOUSE: "Warehouse",
  CONTACT_POINT: "Contact Point",
  OTHER: "Other",
};

export const CONTACT_CHANNEL_ICON: Record<ContactChannelType, string> = {
  PHONE: "phone",
  MOBILE: "mobile-phone",
  EMAIL: "envelope",
  WEBSITE: "globe",
  FACEBOOK: "social-media",
  X_TWITTER: "social-media",
  INSTAGRAM: "camera",
  TIKTOK: "video",
  OTHER: "link",
};

export const CONTACT_CHANNEL_LABEL: Record<ContactChannelType, string> = {
  PHONE: "Phone",
  MOBILE: "Mobile",
  EMAIL: "Email",
  WEBSITE: "Website",
  FACEBOOK: "Facebook",
  X_TWITTER: "X (Twitter)",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  OTHER: "Other",
};

// Active statuses for default list filter
export const ACTIVE_OFFICE_STATUSES: OfficeStatus[] = ["PLANNED", "ACTIVE", "TEMPORARY"];
