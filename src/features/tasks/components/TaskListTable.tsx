import { HTMLTable, Classes, Tag, Intent } from "@blueprintjs/core";
import { useNavigate } from "react-router";
import type { CampaignTask, TaskStatus, TaskPriority } from "../types";

interface Props {
  tasks: CampaignTask[];
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

const STATUS_INTENT: Record<TaskStatus, Intent> = {
  NOT_STARTED: Intent.NONE,
  IN_PROGRESS: Intent.PRIMARY,
  COMPLETED: Intent.SUCCESS,
  CANCELLED: Intent.NONE,
  BLOCKED: Intent.DANGER,
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  BLOCKED: "Blocked",
};

const PRIORITY_INTENT: Record<TaskPriority, Intent> = {
  NONE: Intent.NONE,
  LOW: Intent.NONE,
  MEDIUM: Intent.WARNING,
  HIGH: Intent.DANGER,
  CRITICAL: Intent.DANGER,
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  NONE: "None",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

function StatusTag({ status }: { status: TaskStatus }) {
  return (
    <Tag intent={STATUS_INTENT[status]} minimal>
      {STATUS_LABEL[status]}
    </Tag>
  );
}

function PriorityTag({ priority }: { priority: TaskPriority }) {
  return (
    <Tag intent={PRIORITY_INTENT[priority]} minimal>
      {PRIORITY_LABEL[priority]}
    </Tag>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  const value = Math.min(100, Math.max(0, percent)) / 100;
  let intent = Intent.NONE;
  if (percent >= 80) intent = Intent.SUCCESS;
  else if (percent >= 40) intent = Intent.PRIMARY;
  else if (percent > 0) intent = Intent.WARNING;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          background: "var(--cds-border-subtle, #393939)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background:
              intent === Intent.SUCCESS
                ? "#24a148"
                : intent === Intent.PRIMARY
                  ? "#0f62fe"
                  : intent === Intent.WARNING
                    ? "#f1c21b"
                    : "#525252",
            transition: "width 200ms ease",
          }}
        />
      </div>
      <span
        className={Classes.TEXT_MUTED}
        style={{ fontSize: 11, minWidth: 32, textAlign: "right" }}
      >
        {percent}%
      </span>
    </div>
  );
}

export default function TaskListTable({ tasks }: Props) {
  const navigate = useNavigate();

  return (
    <HTMLTable
      striped
      interactive
      bordered
      style={{ width: "100%", fontSize: 12 }}
    >
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Due Date</th>
          <th>Progress</th>
          <th>Overdue</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr
            key={t.id}
            onClick={() => navigate(`/tasks/${t.id}`)}
            style={{
              cursor: "pointer",
              borderLeft: t.is_overdue
                ? "2px solid var(--bp5-intent-danger-default, #da1e28)"
                : undefined,
            }}
          >
            <td>
              <span style={{ fontWeight: 500 }}>{t.title}</span>
            </td>
            <td>
              <StatusTag status={t.status} />
            </td>
            <td>
              <PriorityTag priority={t.priority} />
            </td>
            <td>{formatDate(t.due_date)}</td>
            <td>
              <ProgressBar percent={t.progress_percent} />
            </td>
            <td>
              {t.is_overdue ? (
                <Tag intent={Intent.DANGER} minimal icon="warning-sign">
                  Overdue
                </Tag>
              ) : (
                <span className={Classes.TEXT_MUTED}>—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}
