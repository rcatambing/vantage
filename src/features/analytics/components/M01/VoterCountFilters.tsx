import { HTMLSelect, Tag, Classes } from "@blueprintjs/core";
import type { MetricFilters, DistrictType } from "../../types";

const DISTRICT_TYPE_OPTIONS: Array<{ label: string; value: DistrictType | "" }> = [
  { label: "All Types", value: "" },
  { label: "Province", value: "PROVINCE" },
  { label: "City", value: "CITY" },
  { label: "Barangay", value: "BARANGAY" },
];

const GENDER_OPTIONS = ["MALE", "FEMALE", "LGBT", "PREFER_NOT_TO_SAY"];
const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  LGBT: "LGBT+",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

const AGE_OPTIONS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

interface Props {
  filters: MetricFilters;
  onChange: (filters: MetricFilters) => void;
}

export default function VoterCountFilters({ filters, onChange }: Props) {
  const handleDistrictType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DistrictType | "";
    onChange({ ...filters, district_type: value || undefined });
  };

  const handleGender = (value: string) => {
    onChange({ ...filters, gender: filters.gender === value ? undefined : value });
  };

  const handleAgeBracket = (value: string) => {
    onChange({ ...filters, age_bracket: filters.age_bracket === value ? undefined : value });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          id="filter-district-type-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          District Type
        </span>
        <HTMLSelect
          aria-labelledby="filter-district-type-label"
          value={filters.district_type ?? ""}
          onChange={handleDistrictType}
          options={DISTRICT_TYPE_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          id="filter-gender-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          Gender
        </span>
        <div role="group" aria-labelledby="filter-gender-label" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {GENDER_OPTIONS.map((g) => (
            <Tag
              key={g}
              interactive
              intent={filters.gender === g ? "primary" : "none"}
              onClick={() => handleGender(g)}
              aria-pressed={filters.gender === g}
              style={{ cursor: "pointer" }}
            >
              {GENDER_LABELS[g] ?? g}
            </Tag>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          id="filter-age-label"
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}
        >
          Age Bracket
        </span>
        <div role="group" aria-labelledby="filter-age-label" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {AGE_OPTIONS.map((a) => (
            <Tag
              key={a}
              interactive
              intent={filters.age_bracket === a ? "primary" : "none"}
              onClick={() => handleAgeBracket(a)}
              aria-pressed={filters.age_bracket === a}
              style={{ cursor: "pointer" }}
            >
              {a}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
