import { HTMLTable } from "@blueprintjs/core";
import type { Office } from "../types";
import { OfficeStatusTag } from "./OfficeStatusTag";
import { OfficeTypeBadge } from "./OfficeTypeBadge";

interface Props {
  offices: Office[];
  onRowClick: (id: string) => void;
}

export function OfficeListTable({ offices, onRowClick }: Props) {
  return (
    <HTMLTable striped interactive bordered style={{ width: "100%", fontSize: 12 }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Type</th>
          <th>Status</th>
          <th>City / Municipality</th>
          <th>Province</th>
          <th style={{ textAlign: "right" }}>Staff</th>
        </tr>
      </thead>
      <tbody>
        {offices.map((office) => (
          <tr key={office.id} onClick={() => onRowClick(office.id)} style={{ cursor: "pointer" }}>
            <td>
              <span style={{ fontWeight: 600 }}>{office.office_name}</span>
            </td>
            <td style={{ color: "var(--cds-text-secondary, #525252)" }}>
              {office.office_code ?? "—"}
            </td>
            <td>
              <OfficeTypeBadge type={office.office_type} />
            </td>
            <td>
              <OfficeStatusTag status={office.status} />
            </td>
            <td>{office.city_municipality ?? "—"}</td>
            <td>{office.province ?? "—"}</td>
            <td style={{ textAlign: "right" }}>{office.staff_count}</td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}
