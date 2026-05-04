import { apiFetch } from "../../../lib/api/client";
import type {
  District,
  DistrictListResponse,
  DistrictParams,
  DistrictCreatePayload,
  DistrictUpdatePayload,
} from "../types";

const BASE = "/districts";

export function getDistricts(params: DistrictParams = {}): Promise<DistrictListResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));
  if (params.search) qs.set("search", params.search);
  if (params.district_type) qs.set("district_type", params.district_type);
  if (params.province) qs.set("province", params.province);
  if (params.city) qs.set("city", params.city);
  if (params.region) qs.set("region", params.region);
  const query = qs.toString();
  return apiFetch<DistrictListResponse>(`${BASE}?${query}`);
}

export function getDistrict(id: string): Promise<District> {
  return apiFetch<District>(`${BASE}/${id}`);
}

export function createDistrict(payload: DistrictCreatePayload): Promise<District> {
  return apiFetch<District>(BASE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateDistrict(id: string, payload: DistrictUpdatePayload): Promise<District> {
  return apiFetch<District>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteDistrict(id: string): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export function searchDistricts(q: string): Promise<District[]> {
  return apiFetch<District[]>(`${BASE}/search?q=${encodeURIComponent(q)}`);
}

export function getDistrictAncestors(id: string): Promise<District[]> {
  return apiFetch<District[]>(`${BASE}/${id}/ancestors`);
}

export function getDistrictChildren(id: string): Promise<District[]> {
  return apiFetch<District[]>(`${BASE}/${id}/children`);
}

/* Legacy exports for backward compatibility */
export const fetchDistricts = getDistricts;
export const fetchDistrict = getDistrict;
