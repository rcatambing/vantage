export interface MetricResponse<T = MetricDataRow> {
  metric_id: string;
  computed_at: string;
  filters_applied: Record<string, string | number>;
  summary: Record<string, number>;
  data: T[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface MetricDataRow {
  district_id: number;
  district_name: string;
  district_type: "PROVINCE" | "CITY" | "BARANGAY" | null;
  registered_count: number;
}

export type DistrictType = "PROVINCE" | "CITY" | "BARANGAY";

export interface MetricFilters {
  district_id?: number;
  district_type?: DistrictType;
  gender?: string;
  age_bracket?: string;
}

export interface MetricM02DataRow {
  district_id: number;
  district_name: string;
  district_type: "PROVINCE" | "CITY" | "BARANGAY" | null;
  city_class: string | null;
  registered: number;
  population: number;
  rate: number;
  income_bracket: string | null;
}

export interface MetricM02TrendPoint {
  year: number;
  registered: number;
}

export interface MetricM02GenderTrendRow {
  gender: string;
  series: MetricM02TrendPoint[];
}

export interface MetricM02AgeTrendRow {
  age_bracket: string;
  series: MetricM02TrendPoint[];
}

export interface MetricM02Response extends MetricResponse<MetricM02DataRow> {
  summary: {
    overall_rate: number;
    total_registered: number;
    total_population: number;
  };
  trends: {
    gender: MetricM02GenderTrendRow[];
    age_bracket: MetricM02AgeTrendRow[];
  };
}

export interface MetricM02Filters {
  district_id?: number;
  district_hierarchy?: DistrictType;
  age_bracket?: string[];
  gender?: string[];
  city_class?: string[];
  income_bracket?: string[];
}

// --- M03: Demographic Breakdown (Age) ---

export interface MetricM03AgeBracketRow {
  age_bracket: string;
  count: number;
  percentage: number;
}

export interface MetricM03DistrictRow {
  district_id: number;
  district_name: string;
  district_type: "PROVINCE" | "CITY" | "BARANGAY" | null;
  age_brackets: MetricM03AgeBracketRow[];
}

export interface MetricM03GenderRow {
  age_bracket: string;
  male: number;
  female: number;
  other: number;
}

export interface MetricM03Response {
  metric_id: string;
  computed_at: string;
  filters_applied: Record<string, string | string[] | number>;
  summary: {
    total_voters: number;
    age_brackets_count: number;
  };
  data: MetricM03AgeBracketRow[];
  by_district: MetricM03DistrictRow[];
  by_gender: MetricM03GenderRow[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface MetricM03Filters {
  district_id?: number;
  district_hierarchy?: DistrictType;
  gender?: string[];
  voter_status?: string[];
  city_class?: string[];
  income_bracket?: string[];
}

// --- M04: Demographic Breakdown (Gender) ---

export interface MetricM04GenderRow {
  gender: string;
  count: number;
  percentage: number;
}

export interface MetricM04DistrictRow {
  district_id: number;
  district_name: string;
  district_type: "PROVINCE" | "CITY" | "BARANGAY" | null;
  genders: MetricM04GenderRow[];
}

export interface MetricM04AgeBracketRow {
  age_bracket: string;
  male: number;
  female: number;
  lgbt: number;
  prefer_not_to_say: number;
}

export interface MetricM04Response {
  metric_id: string;
  computed_at: string;
  filters_applied: Record<string, string | string[] | number>;
  summary: {
    total_voters: number;
    genders_count: number;
  };
  data: MetricM04GenderRow[];
  by_district: MetricM04DistrictRow[];
  by_age_bracket: MetricM04AgeBracketRow[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface MetricM04Filters {
  district_id?: number;
  district_hierarchy?: DistrictType;
  age_bracket?: string[];
  voter_status?: string[];
  city_class?: string[];
  income_bracket?: string[];
}
