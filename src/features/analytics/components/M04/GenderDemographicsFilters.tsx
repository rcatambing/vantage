import { HTMLSelect, Tag, Classes } from "@blueprintjs/core";
import type { DistrictType, MetricM04Filters } from "../../types";

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

const AGE_BRACKET_OPTIONS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

const CITY_CLASS_OPTIONS = ["1ST CLASS", "2ND CLASS", "3RD CLASS", "4TH CLASS", "5TH CLASS"];

const INCOME_OPTIONS = ["LOW", "LOWER_MIDDLE", "MIDDLE", "UPPER_MIDDLE", "HIGH"];
const INCOME_LABELS: Record<string, string> = {
  LOW: "Low",
  LOWER_MIDDLE: "Lower middle",
  MIDDLE: "Middle",
  UPPER_MIDDLE: "Upper middle",
  HIGH: "High",
};

const VOTER_STATUS_OPTIONS = ["REGISTERED", "VERIFIED", "INACTIVE", "DECEASED"];
const VOTER_STATUS_LABELS: Record<string, string> = {
  REGISTERED: "Registered",
  VERIFIED: "Verified",
  INACTIVE: "Inactive",
  DECEASED: "Deceased",
};

interface Props {
  filters: MetricM04Filters;
  onChange: (filters: MetricM04Filters) => void;
}

function toggleSelection(current: string[] | undefined, value: string): string[] {
  const values = current ?? [];
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }
  return [...values, value];
}

export default function GenderDemographicsFilters({ filters, onChange }: Props) {
  const handleDistrictHierarchy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DistrictType | "";
    onChange({ ...filters, district_hierarchy: value || undefined });
  };

  const handleAgeBracketToggle = (value: string) => {
    const next = toggleSelection(filters.age_bracket, value);
    onChange({ ...filters, age_bracket: next.length > 0 ? next : undefined });
  };

  const handleCityClassToggle = (value: string) => {
    const next = toggleSelection(filters.city_class, value);
    onChange({ ...filters, city_class: next.length > 0 ? next : undefined });
  };

  const handleIncomeToggle = (value: string) => {
    const next = toggleSelection(filters.income_bracket, value);
    onChange({ ...filters, income_bracket: next.length > 0 ? next : undefined });
  };

  const handleVoterStatusToggle = (value: string) => {
    const next = toggleSelection(filters.voter_status, value);
    onChange({ ...filters, voter_status: next.length > 0 ? next : undefined });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          id="m04-filter-district-hierarchy-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          District Hierarchy
        </span>
        <HTMLSelect
          aria-labelledby="m04-filter-district-hierarchy-label"
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
          id="m04-filter-age-bracket-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          Age Bracket
        </span>
        <div role="group" aria-labelledby="m04-filter-age-bracket-label" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {AGE_BRACKET_OPTIONS.map((value) => (
            <Tag
              key={value}
              interactive
              intent={filters.age_bracket?.includes(value) ? "primary" : "none"}
              onClick={() => handleAgeBracketToggle(value)}
              onKeyDown={handleTagKeyDown(() => handleAgeBracketToggle(value))}
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
          id="m04-filter-city-class-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          City Class
        </span>
        <div role="group" aria-labelledby="m04-filter-city-class-label" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
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
          id="m04-filter-income-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          Income Bracket
        </span>
        <div role="group" aria-labelledby="m04-filter-income-label" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
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

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          id="m04-filter-voter-status-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          Voter Status
        </span>
        <div role="group" aria-labelledby="m04-filter-voter-status-label" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {VOTER_STATUS_OPTIONS.map((value) => (
            <Tag
              key={value}
              interactive
              intent={filters.voter_status?.includes(value) ? "primary" : "none"}
              onClick={() => handleVoterStatusToggle(value)}
              onKeyDown={handleTagKeyDown(() => handleVoterStatusToggle(value))}
              tabIndex={0}
              role="button"
              aria-pressed={filters.voter_status?.includes(value) ?? false}
              style={{ cursor: "pointer" }}
            >
              {VOTER_STATUS_LABELS[value] ?? value}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
