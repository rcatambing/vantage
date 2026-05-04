import { apiFetch } from "../../../lib/api/client";
import type { District, DistrictListResponse, DistrictParams } from "../types";

const BASE = "/districts";

export function fetchDistricts(params: DistrictParams = {}): Promise<DistrictListResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));
  if (params.search) qs.set("search", params.search);
  if (params.district_type) qs.set("district_type", params.district_type);
  if (params.province) qs.set("province", params.province);
  if (params.city) qs.set("city", params.city);
  const query = qs.toString();
  return apiFetch<DistrictListResponse>(`${BASE}?${query}`);
}

export function fetchDistrict(id: number): Promise<District> {
  return apiFetch<District>(`${BASE}/${id}`);
}
