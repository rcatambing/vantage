import { HTMLTable } from "@blueprintjs/core";
import type { Resource } from "../types";
import { ResourceStatusTag } from "./ResourceStatusTag";
import { ResourceTypeBadge } from "./ResourceTypeBadge";
import { ResourceConditionTag } from "./ResourceConditionTag";

interface Props {
  resources: Resource[];
  onRowClick: (id: string) => void;
}

function formatCurrency(value: number | null): string {
  if (value == null) return "—";
  return `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ResourceListTable({ resources, onRowClick }: Props) {
  return (
    <HTMLTable striped interactive bordered style={{ width: "100%", fontSize: 12 }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Type</th>
          <th>Status</th>
          <th>Condition</th>
          <th>Assigned Office</th>
          <th style={{ textAlign: "right" }}>Current Value</th>
        </tr>
      </thead>
      <tbody>
        {resources.map((resource) => (
          <tr
            key={resource.id}
            onClick={() => onRowClick(resource.id)}
            style={{ cursor: "pointer" }}
          >
            <td>
              <span style={{ fontWeight: 600 }}>{resource.resource_name}</span>
            </td>
            <td style={{ color: "var(--cds-text-secondary, #525252)" }}>
              {resource.resource_code ?? "—"}
            </td>
            <td>
              <ResourceTypeBadge type={resource.resource_type} />
            </td>
            <td>
              <ResourceStatusTag status={resource.status} />
            </td>
            <td>
              <ResourceConditionTag condition={resource.condition} />
            </td>
            <td>{resource.current_assignment?.office_name ?? "—"}</td>
            <td style={{ textAlign: "right" }}>
              {formatCurrency(resource.current_value)}
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}
