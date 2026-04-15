import { HTMLSelect, InputGroup } from "@blueprintjs/core";
import type { OfficeStatus, OfficeType } from "../types";

const OFFICE_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "HQ", label: "Headquarters" },
  { value: "FIELD_OFFICE", label: "Field Office" },
  { value: "BRANCH", label: "Branch" },
  { value: "SATELLITE", label: "Satellite Site" },
  { value: "WAREHOUSE", label: "Warehouse" },
  { value: "CONTACT_POINT", label: "Contact Point" },
  { value: "OTHER", label: "Other" },
];

const OFFICE_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PLANNED", label: "Planned" },
  { value: "ACTIVE", label: "Active" },
  { value: "TEMPORARY", label: "Temporary" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "CLOSED", label: "Closed" },
  { value: "ARCHIVED", label: "Archived" },
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  officeTypeFilter: OfficeType | "";
  onOfficeTypeChange: (v: OfficeType | "") => void;
  statusFilter: OfficeStatus | "";
  onStatusChange: (v: OfficeStatus | "") => void;
}

export function OfficeFilterBar({
  search,
  onSearchChange,
  officeTypeFilter,
  onOfficeTypeChange,
  statusFilter,
  onStatusChange,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <InputGroup
        leftIcon="search"
        placeholder="Search offices…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ minWidth: 220 }}
      />
      <HTMLSelect
        value={officeTypeFilter}
        onChange={(e) => onOfficeTypeChange(e.target.value as OfficeType | "")}
        options={OFFICE_TYPE_OPTIONS}
      />
      <HTMLSelect
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as OfficeStatus | "")}
        options={OFFICE_STATUS_OPTIONS}
      />
    </div>
  );
}
