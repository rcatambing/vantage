import { Intent } from "@blueprintjs/core";

export type VoterStatus = "REGISTERED" | "UNREGISTERED" | "INACTIVE" | "DECEASED";
export type AgeGroup = "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Voter {
  id: string;
  full_name: string;
  age: number;
  age_group: AgeGroup;
  gender: Gender;
  district_id: string;
  district_name: string;
  status: VoterStatus;
  last_contact: string | null;
  phone: string | null;
  email: string | null;
  affiliations: { type: string; value: string }[];
  signals: { type: string; strength: number }[];
}

export interface VoterImportResult {
  success_count: number;
  error_count: number;
  error_rows: { row: number; reason: string }[];
}

export interface VoterCreatePayload {
  full_name: string;
  age: number;
  gender: Gender;
  district_id: string;
  status?: VoterStatus;
  phone?: string;
  email?: string;
}

export interface VoterUpdatePayload {
  full_name?: string;
  age?: number;
  gender?: Gender;
  district_id?: string;
  status?: VoterStatus;
  phone?: string | null;
  email?: string | null;
}

export interface VoterFilters {
  status?: VoterStatus | VoterStatus[];
  age_group?: AgeGroup | AgeGroup[];
  gender?: Gender | Gender[];
  district_id?: string;
  campaign_id?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedVoters {
  items: Voter[];
  total: number;
  page: number;
  page_size: number;
}

export const VOTER_STATUS_INTENT: Record<VoterStatus, Intent> = {
  REGISTERED: Intent.SUCCESS,
  UNREGISTERED: Intent.WARNING,
  INACTIVE: Intent.NONE,
  DECEASED: Intent.DANGER,
};

export const VOTER_STATUS_LABEL: Record<VoterStatus, string> = {
  REGISTERED: "Registered",
  UNREGISTERED: "Unregistered",
  INACTIVE: "Inactive",
  DECEASED: "Deceased",
};

export const AGE_GROUP_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: "18-24", label: "18–24" },
  { value: "25-34", label: "25–34" },
  { value: "35-44", label: "35–44" },
  { value: "45-54", label: "45–54" },
  { value: "55-64", label: "55–64" },
  { value: "65+", label: "65+" },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const STATUS_OPTIONS: { value: VoterStatus; label: string }[] = [
  { value: "REGISTERED", label: "Registered" },
  { value: "UNREGISTERED", label: "Unregistered" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "DECEASED", label: "Deceased" },
];
