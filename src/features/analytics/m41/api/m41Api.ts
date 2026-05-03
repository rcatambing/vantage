import { apiFetch } from "../../../../lib/api/client";
import type { M41Data, M41Params } from "../types";

const BASE = "/analytics/metrics/M41";

export function fetchM41(params: M41Params): Promise<M41Data> {
  const qs = new URLSearchParams({ campaign_id: String(params.campaign_id) });
  if (params.district_id != null) qs.set("district_id", String(params.district_id));
  if (params.contact_type != null) qs.set("contact_type", params.contact_type);
  return apiFetch<M41Data>(`${BASE}?${qs.toString()}`);
}
