import { useState } from "react";
import { HTMLTable, Classes } from "@blueprintjs/core";
import type { M16Objective } from "../types";

type SortKey = "objective_title" | "task_count" | "objective_status";
type SortDir = "asc" | "desc";

interface Props {
  objectives: M16Objective[];
}

export default function ObjectiveDrillTable({ objectives }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("task_count");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...objectives].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "task_count") cmp = a.task_count - b.task_count;
    else if (sortKey === "objective_title") cmp = a.objective_title.localeCompare(b.objective_title);
    else if (sortKey === "objective_status") cmp = a.objective_status.localeCompare(b.objective_status);
    return sortDir === "asc" ? cmp : -cmp;
  });

  function SortIndicator({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span style={{ opacity: 0.3 }}> ↕</span>;
    return <span>{sortDir === "asc" ? " ↑" : " ↓"}</span>;
  }

  const thStyle: React.CSSProperties = { cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };

  if (objectives.length === 0) {
    return (
      <p className={Classes.TEXT_MUTED} style={{ margin: "8px 0", fontSize: 13 }}>
        No objectives found.
      </p>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <HTMLTable striped bordered style={{ width: "100%", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={thStyle} onClick={() => handleSort("objective_title")}>
              Objective <SortIndicator col="objective_title" />
            </th>
            <th style={thStyle} onClick={() => handleSort("objective_status")}>
              Status <SortIndicator col="objective_status" />
            </th>
            <th style={thStyle} onClick={() => handleSort("task_count")}>
              Tasks <SortIndicator col="task_count" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((obj) => (
            <tr
              key={String(obj.objective_id)}
              style={obj.task_count === 0 ? { background: "#fff1f1" } : undefined}
            >
              <td>{obj.objective_title}</td>
              <td className={Classes.TEXT_MUTED} style={{ textTransform: "capitalize", whiteSpace: "nowrap" }}>
                {obj.objective_status.toLowerCase().replace("_", " ")}
              </td>
              <td
                style={{
                  fontWeight: obj.task_count === 0 ? 600 : 400,
                  color: obj.task_count === 0 ? "#da1e28" : "inherit",
                  textAlign: "right",
                }}
              >
                {obj.task_count === 0 ? "None" : obj.task_count}
              </td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </div>
  );
}
