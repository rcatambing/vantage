import { HTMLTable, Tag, Intent, Classes } from "@blueprintjs/core";
import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
}

export default function DataTable<T extends { id: string }>({ columns, data }: Props<T>) {
  return (
    <HTMLTable striped interactive bordered compact style={{ width: "100%", fontSize: 12 }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.key}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}

/* Reusable cell helpers */
export function StatusTag({ status }: { status: string }) {
  const intentMap: Record<string, Intent> = {
    Active: Intent.SUCCESS,
    Completed: Intent.PRIMARY,
    Planning: Intent.WARNING,
    "On Hold": Intent.NONE,
    Overdue: Intent.DANGER,
    "In Progress": Intent.PRIMARY,
  };
  return <Tag minimal intent={intentMap[status] ?? Intent.NONE}>{status}</Tag>;
}

export function ProgressCell({ value }: { value: number }) {
  const color =
    value >= 75 ? "#24a148" : value >= 40 ? "#f1c21b" : "#da1e28";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div className="progress-mini" style={{ flex: 1 }}>
        <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className={Classes.TEXT_MUTED} style={{ fontSize: 11, width: 30, textAlign: "right" }}>
        {value}%
      </span>
    </div>
  );
}
