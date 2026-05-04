export type DistrictType = 'PROVINCE' | 'CITY' | 'BARANGAY';

export interface District {
  id: string;
  district_code: string;
  name: string;
  district_type: DistrictType;
  region: string;
  parent_district_id: string | null;
  parent_name: string | null;
  population: number | null;
  registered_voters: number | null;
  metadata: Record<string, unknown>;
  children?: District[];
  statistics?: DistrictStatistics;
  /* Legacy fields for backward compatibility */
  district_id?: number;
  district_name?: string;
  congressional_district?: string | null;
  city_class?: string | null;
  province?: string | null;
  city?: string | null;
  barangay?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DistrictStatistics {
  population_count: number;
  voter_count: number;
  turnout_estimate: number | null;
  age_distribution: Record<string, number>;
  gender_distribution: Record<string, number>;
}

export interface DistrictListResponse {
  items: District[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface DistrictParams {
  page?: number;
  page_size?: number;
  search?: string;
  district_type?: string;
  province?: string;
  city?: string;
  region?: string;
}

export interface DistrictCreatePayload {
  name: string;
  district_type: DistrictType;
  region: string;
  parent_district_id?: string | null;
  metadata?: Record<string, unknown>;
}

export interface DistrictUpdatePayload {
  name?: string;
  region?: string;
  metadata?: Record<string, unknown>;
}
