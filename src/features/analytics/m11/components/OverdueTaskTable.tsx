import { useState } from "react";
import { HTMLTable, Classes } from "@blueprintjs/core";
import type { M11Task } from "../types";

type SortKey = "days_overdue" | "due_date" | "task_title" | "assignee_name";
type SortDir = "asc" | "desc";

interface Props {
  tasks: M11Task[];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

export default function OverdueTaskTable({ tasks }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("days_overdue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = [...tasks].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "days_overdue") cmp = a.days_overdue - b.days_overdue;
    else if (sortKey === "due_date") cmp = a.due_date.localeCompare(b.due_date);
    else if (sortKey === "task_title") cmp = a.task_title.localeCompare(b.task_title);
    else if (sortKey === "assignee_name")
      cmp = (a.assignee_name ?? "").localeCompare(b.assignee_name ?? "");
    return sortDir === "asc" ? cmp : -cmp;
  });

  function SortIndicator({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span style={{ opacity: 0.3 }}> ↕</span>;
    return <span>{sortDir === "desc" ? " ↓" : " ↑"}</span>;
  }

  const thStyle: React.CSSProperties = { cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };

  if (tasks.length === 0) {
    return (
      <p className={Classes.TEXT_MUTED} style={{ margin: "8px 0", fontSize: 13 }}>
        No overdue tasks found.
      </p>
    );
  }

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 320 }}>
      <HTMLTable striped bordered style={{ width: "100%", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={thStyle} onClick={() => handleSort("task_title")}>
              Task <SortIndicator col="task_title" />
            </th>
            <th style={thStyle} onClick={() => handleSort("assignee_name")}>
              Assignee <SortIndicator col="assignee_name" />
            </th>
            <th style={thStyle} onClick={() => handleSort("due_date")}>
              Due Date <SortIndicator col="due_date" />
            </th>
            <th style={thStyle} onClick={() => handleSort("days_overdue")}>
              Days Overdue <SortIndicator col="days_overdue" />
            </th>
            <th>Objective</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((task) => (
            <tr key={task.task_id}>
              <td>{task.task_title}</td>
              <td>{task.assignee_name ?? <span className={Classes.TEXT_MUTED}>—</span>}</td>
              <td style={{ whiteSpace: "nowrap" }}>{formatDate(task.due_date)}</td>
              <td
                style={{
                  fontWeight: 500,
                  color: task.days_overdue > 7 ? "#da1e28" : "#f1c21b",
                  whiteSpace: "nowrap",
                }}
              >
                {task.days_overdue}d
              </td>
              <td className={Classes.TEXT_MUTED}>{task.objective_title}</td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </div>
  );
}
