import { HTMLSelect, InputGroup } from "@blueprintjs/core";
import type { ResourceType, ResourceStatus, ResourceCondition } from "../types";

const RESOURCE_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "VEHICLE", label: "Vehicle" },
  { value: "EQUIPMENT", label: "Equipment" },
  { value: "IT_ASSET", label: "IT Asset" },
  { value: "FURNITURE", label: "Furniture" },
  { value: "SUPPLIES", label: "Supplies" },
  { value: "COMMUNICATION", label: "Communication" },
  { value: "OTHER", label: "Other" },
];

const RESOURCE_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "AVAILABLE", label: "Available" },
  { value: "IN_USE", label: "In Use" },
  { value: "UNDER_MAINTENANCE", label: "Maintenance" },
  { value: "RESERVED", label: "Reserved" },
  { value: "DECOMMISSIONED", label: "Decommissioned" },
  { value: "DISPOSED", label: "Disposed" },
];

const RESOURCE_CONDITION_OPTIONS = [
  { value: "", label: "All Conditions" },
  { value: "NEW", label: "New" },
  { value: "EXCELLENT", label: "Excellent" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
  { value: "NON_FUNCTIONAL", label: "Non-Functional" },
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  resourceTypeFilter: ResourceType | "";
  onResourceTypeChange: (v: ResourceType | "") => void;
  statusFilter: ResourceStatus | "";
  onStatusChange: (v: ResourceStatus | "") => void;
  conditionFilter: ResourceCondition | "";
  onConditionChange: (v: ResourceCondition | "") => void;
}

export function ResourceFilterBar({
  search,
  onSearchChange,
  resourceTypeFilter,
  onResourceTypeChange,
  statusFilter,
  onStatusChange,
  conditionFilter,
  onConditionChange,
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
        placeholder="Search resources…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ minWidth: 220 }}
      />
      <HTMLSelect
        value={resourceTypeFilter}
        onChange={(e) => onResourceTypeChange(e.target.value as ResourceType | "")}
        options={RESOURCE_TYPE_OPTIONS}
      />
      <HTMLSelect
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as ResourceStatus | "")}
        options={RESOURCE_STATUS_OPTIONS}
      />
      <HTMLSelect
        value={conditionFilter}
        onChange={(e) => onConditionChange(e.target.value as ResourceCondition | "")}
        options={RESOURCE_CONDITION_OPTIONS}
      />
    </div>
  );
}
