export interface District {
  district_id: number;
  district_code: string;
  district_name: string;
  district_type: string;
  parent_district_id: number | null;
  congressional_district: string | null;
  city_class: string | null;
  region: string | null;
  province: string | null;
  city: string | null;
  barangay: string | null;
  created_at: string;
  updated_at: string;
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
}
