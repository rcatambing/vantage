import { HTMLSelect, Tag, Classes } from "@blueprintjs/core";
import type { DistrictType, MetricM02Filters } from "../../types";

function handleTagKeyDown(callback: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };
}

const DISTRICT_HIERARCHY_OPTIONS: Array<{ label: string; value: DistrictType | "" }> = [
  { label: "All Levels", value: "" },
  { label: "Province", value: "PROVINCE" },
  { label: "City", value: "CITY" },
  { label: "Barangay", value: "BARANGAY" },
];

const AGE_OPTIONS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

const GENDER_OPTIONS = ["MALE", "FEMALE", "LGBT", "PREFER_NOT_TO_SAY"];
const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  LGBT: "LGBT+",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

const CITY_CLASS_OPTIONS = ["1ST CLASS", "2ND CLASS", "3RD CLASS", "4TH CLASS", "5TH CLASS"];

const INCOME_OPTIONS = ["LOW", "LOWER_MIDDLE", "MIDDLE", "UPPER_MIDDLE", "HIGH"];
const INCOME_LABELS: Record<string, string> = {
  LOW: "Low",
  LOWER_MIDDLE: "Lower middle",
  MIDDLE: "Middle",
  UPPER_MIDDLE: "Upper middle",
  HIGH: "High",
};

interface Props {
  filters: MetricM02Filters;
  onChange: (filters: MetricM02Filters) => void;
}

function toggleSelection(current: string[] | undefined, value: string): string[] {
  const values = current ?? [];
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }
  return [...values, value];
}

export default function RegistrationRateFilters({ filters, onChange }: Props) {
  const handleDistrictHierarchy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DistrictType | "";
    onChange({ ...filters, district_hierarchy: value || undefined });
  };

  const handleAgeToggle = (value: string) => {
    const next = toggleSelection(filters.age_bracket, value);
    onChange({ ...filters, age_bracket: next.length > 0 ? next : undefined });
  };

  const handleGenderToggle = (value: string) => {
    const next = toggleSelection(filters.gender, value);
    onChange({ ...filters, gender: next.length > 0 ? next : undefined });
  };

  const handleCityClassToggle = (value: string) => {
    const next = toggleSelection(filters.city_class, value);
    onChange({ ...filters, city_class: next.length > 0 ? next : undefined });
  };

  const handleIncomeToggle = (value: string) => {
    const next = toggleSelection(filters.income_bracket, value);
    onChange({ ...filters, income_bracket: next.length > 0 ? next : undefined });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          id="m02-filter-district-hierarchy-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          District Hierarchy
        </span>
        <HTMLSelect
          aria-labelledby="m02-filter-district-hierarchy-label"
          value={filters.district_hierarchy ?? ""}
          onChange={handleDistrictHierarchy}
          options={DISTRICT_HIERARCHY_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          id="m02-filter-age-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          Age Bracket
        </span>
        <div role="group" aria-labelledby="m02-filter-age-label" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {AGE_OPTIONS.map((value) => (
            <Tag
              key={value}
              interactive
              intent={filters.age_bracket?.includes(value) ? "primary" : "none"}
              onClick={() => handleAgeToggle(value)}
              onKeyDown={handleTagKeyDown(() => handleAgeToggle(value))}
              tabIndex={0}
              role="button"
              aria-pressed={filters.age_bracket?.includes(value) ?? false}
              style={{ cursor: "pointer" }}
            >
              {value}
            </Tag>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          id="m02-filter-gender-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          Gender
        </span>
        <div role="group" aria-labelledby="m02-filter-gender-label" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {GENDER_OPTIONS.map((value) => (
            <Tag
              key={value}
              interactive
              intent={filters.gender?.includes(value) ? "primary" : "none"}
              onClick={() => handleGenderToggle(value)}
              onKeyDown={handleTagKeyDown(() => handleGenderToggle(value))}
              tabIndex={0}
              role="button"
              aria-pressed={filters.gender?.includes(value) ?? false}
              style={{ cursor: "pointer" }}
            >
              {GENDER_LABELS[value] ?? value}
            </Tag>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          id="m02-filter-city-class-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          City Class
        </span>
        <div role="group" aria-labelledby="m02-filter-city-class-label" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {CITY_CLASS_OPTIONS.map((value) => (
            <Tag
              key={value}
              interactive
              intent={filters.city_class?.includes(value) ? "primary" : "none"}
              onClick={() => handleCityClassToggle(value)}
              onKeyDown={handleTagKeyDown(() => handleCityClassToggle(value))}
              tabIndex={0}
              role="button"
              aria-pressed={filters.city_class?.includes(value) ?? false}
              style={{ cursor: "pointer" }}
            >
              {value}
            </Tag>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          id="m02-filter-income-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          Income Bracket
        </span>
        <div role="group" aria-labelledby="m02-filter-income-label" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {INCOME_OPTIONS.map((value) => (
            <Tag
              key={value}
              interactive
              intent={filters.income_bracket?.includes(value) ? "primary" : "none"}
              onClick={() => handleIncomeToggle(value)}
              onKeyDown={handleTagKeyDown(() => handleIncomeToggle(value))}
              tabIndex={0}
              role="button"
              aria-pressed={filters.income_bracket?.includes(value) ?? false}
              style={{ cursor: "pointer" }}
            >
              {INCOME_LABELS[value] ?? value}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
