import { apiFetch } from "../../../lib/api/client";
import type {
  MetricResponse,
  MetricFilters,
  MetricM02Response,
  MetricM02Filters,
  MetricM03Response,
  MetricM03Filters,
  MetricM04Response,
  MetricM04Filters,
} from "../types";

export async function fetchMetricM01(filters?: MetricFilters): Promise<MetricResponse> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.district_id !== undefined) {
      params.set("district_id", String(filters.district_id));
    }
    if (filters.district_type !== undefined) {
      params.set("district_type", filters.district_type);
    }
    if (filters.gender !== undefined) {
      params.set("gender", filters.gender);
    }
    if (filters.age_bracket !== undefined) {
      params.set("age_bracket", filters.age_bracket);
    }
  }

  const query = params.toString();
  const path = `/analytics/metrics/M01${query ? `?${query}` : ""}`;

  return apiFetch<MetricResponse>(path);
}

function appendMultiValueParams(params: URLSearchParams, key: string, values?: string[]) {
  if (!values || values.length === 0) {
    return;
  }
  values.forEach((value) => {
    params.append(key, value);
  });
}

export async function fetchMetricM02(filters?: MetricM02Filters): Promise<MetricM02Response> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.district_id !== undefined) {
      params.set("district_id", String(filters.district_id));
    }
    if (filters.district_hierarchy !== undefined) {
      params.set("district_hierarchy", filters.district_hierarchy);
    }

    appendMultiValueParams(params, "age_bracket", filters.age_bracket);
    appendMultiValueParams(params, "gender", filters.gender);
    appendMultiValueParams(params, "city_class", filters.city_class);
    appendMultiValueParams(params, "income_bracket", filters.income_bracket);
  }

  const query = params.toString();
  const path = `/analytics/metrics/M02${query ? `?${query}` : ""}`;

  return apiFetch<MetricM02Response>(path);
}

export async function fetchMetricM03(filters?: MetricM03Filters): Promise<MetricM03Response> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.district_id !== undefined) {
      params.set("district_id", String(filters.district_id));
    }
    if (filters.district_hierarchy !== undefined) {
      params.set("district_hierarchy", filters.district_hierarchy);
    }

    appendMultiValueParams(params, "gender", filters.gender);
    appendMultiValueParams(params, "voter_status", filters.voter_status);
    appendMultiValueParams(params, "city_class", filters.city_class);
    appendMultiValueParams(params, "income_bracket", filters.income_bracket);
  }

  const query = params.toString();
  const path = `/analytics/metrics/M03${query ? `?${query}` : ""}`;

  return apiFetch<MetricM03Response>(path);
}

export async function fetchMetricM04(filters?: MetricM04Filters): Promise<MetricM04Response> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.district_id !== undefined) {
      params.set("district_id", String(filters.district_id));
    }
    if (filters.district_hierarchy !== undefined) {
      params.set("district_hierarchy", filters.district_hierarchy);
    }

    appendMultiValueParams(params, "age_bracket", filters.age_bracket);
    appendMultiValueParams(params, "voter_status", filters.voter_status);
    appendMultiValueParams(params, "city_class", filters.city_class);
    appendMultiValueParams(params, "income_bracket", filters.income_bracket);
  }

  const query = params.toString();
  const path = `/analytics/metrics/M04${query ? `?${query}` : ""}`;

  return apiFetch<MetricM04Response>(path);
}
