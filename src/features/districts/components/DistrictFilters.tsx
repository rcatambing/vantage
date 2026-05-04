import { useCallback } from "react";
import { Button, HTMLSelect, FormGroup } from "@blueprintjs/core";

export interface DistrictFilterValues {
  districtType: string;
  region: string;
  province: string;
}

interface Props {
  regions: string[];
  provinces: string[];
  values: DistrictFilterValues;
  onChange: (values: DistrictFilterValues) => void;
  onClear: () => void;
}

/**
 * District filter controls with cascading province select.
 * Type HTMLSelect (PROVINCE/CITY/BARANGAY), Region HTMLSelect,
 * Province Select, and Clear filters button.
 */
export default function DistrictFilters({ regions, provinces, values, onChange, onClear }: Props) {
  const handleChange = useCallback(
    (field: keyof DistrictFilterValues, value: string) => {
      onChange({ ...values, [field]: value });
    },
    [values, onChange],
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 12,
        flexWrap: "wrap",
        padding: "12px 0",
      }}
    >
      <FormGroup label="Type" style={{ margin: 0, minWidth: 140 }}>
        <HTMLSelect
          value={values.districtType}
          onChange={(e) => handleChange("districtType", e.target.value)}
          fill
          aria-label="Filter by district type"
        >
          <option value="">All types</option>
          <option value="PROVINCE">Province</option>
          <option value="CITY">City</option>
          <option value="BARANGAY">Barangay</option>
        </HTMLSelect>
      </FormGroup>

      <FormGroup label="Region" style={{ margin: 0, minWidth: 160 }}>
        <HTMLSelect
          value={values.region}
          onChange={(e) => handleChange("region", e.target.value)}
          fill
          aria-label="Filter by region"
        >
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </HTMLSelect>
      </FormGroup>

      <FormGroup label="Province" style={{ margin: 0, minWidth: 160 }}>
        <HTMLSelect
          value={values.province}
          onChange={(e) => handleChange("province", e.target.value)}
          fill
          aria-label="Filter by province"
        >
          <option value="">All provinces</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </HTMLSelect>
      </FormGroup>

      <Button minimal icon="filter-remove" onClick={onClear} aria-label="Clear filters">
        Clear
      </Button>
    </div>
  );
}
