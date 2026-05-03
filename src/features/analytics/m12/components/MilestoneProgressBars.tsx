import { Classes } from "@blueprintjs/core";
import type { M12TaskProgress } from "../types";

interface Props {
  tasks: M12TaskProgress[];
}

export default function MilestoneProgressBars({ tasks }: Props) {
  const withMilestones = tasks.filter((t) => t.total_milestones > 0);
  const withoutMilestones = tasks.filter((t) => t.total_milestones === 0);

  if (tasks.length === 0) {
    return (
      <p className={Classes.TEXT_MUTED} style={{ margin: "4px 0", fontSize: 13 }}>
        No tasks found.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {withMilestones.map((task) => (
        <div key={task.task_id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 3,
            }}
          >
            <span style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "78%" }}>
              {task.task_title}
            </span>
            <span className={Classes.TEXT_MUTED} style={{ fontSize: 11, whiteSpace: "nowrap" }}>
              {task.completed_milestones}/{task.total_milestones}
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: "#e0e0e0",
              borderRadius: 4,
              overflow: "hidden",
            }}
            role="progressbar"
            aria-valuenow={task.progress_percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              style={{
                height: "100%",
                width: `${task.progress_percent}%`,
                background: "var(--cds-interactive)",
                borderRadius: 4,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      ))}
      {withoutMilestones.length > 0 && (
        <p className={Classes.TEXT_MUTED} style={{ fontSize: 11, margin: "4px 0 0" }}>
          {withoutMilestones.length} task{withoutMilestones.length > 1 ? "s" : ""} with no milestones tracked.
        </p>
      )}
    </div>
  );
}
