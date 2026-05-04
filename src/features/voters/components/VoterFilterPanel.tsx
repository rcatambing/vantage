import { useState } from "react";
import {
  Button,
  Drawer,
  FormGroup,
  HTMLSelect,
  Checkbox,
  Classes,
} from "@blueprintjs/core";
import type { VoterFilters, VoterStatus, AgeGroup, Gender } from "../types";
import {
  STATUS_OPTIONS,
  AGE_GROUP_OPTIONS,
  GENDER_OPTIONS,
} from "../types";

interface Props {
  filters: VoterFilters;
  onChange: (filters: Partial<VoterFilters>) => void;
}

export default function VoterFilterPanel({ filters, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedStatuses = Array.isArray(filters.status)
    ? filters.status
    : filters.status
      ? [filters.status]
      : [];

  const toggleStatus = (status: VoterStatus) => {
    const next = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onChange({ status: next.length > 0 ? next : undefined });
  };

  return (
    <>
      <Button
        icon="filter"
        text="Filters"
        onClick={() => setIsOpen(true)}
      />
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filter Voters"
        icon="filter"
        size={360}
      >
        <div style={{ padding: 20 }}>
          <FormGroup label="Status">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STATUS_OPTIONS.map((opt) => (
                <Checkbox
                  key={opt.value}
                  checked={selectedStatuses.includes(opt.value)}
                  onChange={() => toggleStatus(opt.value)}
                  label={opt.label}
                />
              ))}
            </div>
          </FormGroup>

          <FormGroup label="Age Group">
            <HTMLSelect
              fill
              value={(filters.age_group as string) ?? ""}
              onChange={(e) =>
                onChange({
                  age_group: (e.target.value as AgeGroup) || undefined,
                })
              }
              options={[
                { value: "", label: "All age groups" },
                ...AGE_GROUP_OPTIONS,
              ]}
            />
          </FormGroup>

          <FormGroup label="Gender">
            <HTMLSelect
              fill
              value={(filters.gender as string) ?? ""}
              onChange={(e) =>
                onChange({
                  gender: (e.target.value as Gender) || undefined,
                })
              }
              options={[
                { value: "", label: "All genders" },
                ...GENDER_OPTIONS,
              ]}
            />
          </FormGroup>

          <FormGroup label="District">
            <input
              type="text"
              className={Classes.INPUT}
              placeholder="District ID…"
              value={filters.district_id ?? ""}
              onChange={(e) =>
                onChange({
                  district_id: e.target.value || undefined,
                })
              }
              style={{ width: "100%" }}
            />
          </FormGroup>

          <div style={{ marginTop: 24 }}>
            <Button
              minimal
              icon="filter-remove"
              text="Clear filters"
              onClick={() =>
                onChange({
                  status: undefined,
                  age_group: undefined,
                  gender: undefined,
                  district_id: undefined,
                })
              }
            />
          </div>
        </div>
      </Drawer>
    </>
  );
}
