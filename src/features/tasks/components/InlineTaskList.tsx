import { useState } from "react";
import {
  Button,
  Tag,
  Intent,
  InputGroup,
  HTMLSelect,
  Classes,
} from "@blueprintjs/core";
import type { CampaignTask, TaskStatus } from "../types";
import { useTaskMutations } from "../hooks/useTaskMutations";
import TaskCreateDialog from "./TaskCreateDialog";

interface Props {
  objectiveId: string;
  campaignId: string;
  tasks: CampaignTask[];
  onMutate: () => void;
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

function MiniProgressBar({ percent }: { percent: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, width: 80 }}>
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
              percent >= 80
                ? "#24a148"
                : percent >= 40
                  ? "#0f62fe"
                  : "#f1c21b",
            transition: "width 200ms ease",
          }}
        />
      </div>
      <span className={Classes.TEXT_MUTED} style={{ fontSize: 10 }}>
        {percent}%
      </span>
    </div>
  );
}

export default function InlineTaskList({
  objectiveId,
  campaignId,
  tasks,
  onMutate,
}: Props) {
  const { update, remove } = useTaskMutations({ onSuccess: onMutate });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState<TaskStatus>("NOT_STARTED");
  const [createOpen, setCreateOpen] = useState(false);

  const objectiveTasks = tasks.filter((t) =>
    t.objective_ids.includes(objectiveId)
  );

  const startEdit = (task: CampaignTask) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditStatus(task.status);
  };

  const saveEdit = async (taskId: string) => {
    const success = await update(taskId, {
      title: editTitle.trim(),
      status: editStatus,
    });
    if (success) setEditingId(null);
  };

  return (
    <div style={{ marginTop: 8 }}>
      {objectiveTasks.length === 0 && (
        <p
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, fontStyle: "italic", margin: "4px 0" }}
        >
          No tasks for this objective.
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {objectiveTasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 0",
              borderBottom: "1px solid var(--cds-border-subtle, #393939)",
              fontSize: 13,
            }}
          >
            {editingId === task.id ? (
              <>
                <InputGroup
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  small
                  fill
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(task.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
                <HTMLSelect
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                  options={Object.entries(STATUS_LABEL).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
                <Button
                  icon="tick"
                  small
                  minimal
                  intent={Intent.SUCCESS}
                  onClick={() => saveEdit(task.id)}
                  aria-label="Save task edit"
                />
                <Button
                  icon="cross"
                  small
                  minimal
                  onClick={() => setEditingId(null)}
                  aria-label="Cancel task edit"
                />
              </>
            ) : (
              <>
                <span style={{ flex: 1, minWidth: 0 }}>{task.title}</span>
                <Tag
                  minimal
                  intent={STATUS_INTENT[task.status]}
                  style={{ fontSize: 11 }}
                >
                  {STATUS_LABEL[task.status]}
                </Tag>
                <span
                  className={Classes.TEXT_MUTED}
                  style={{ fontSize: 11, minWidth: 70 }}
                >
                  {task.assignee_id
                    ? task.assignee_id.slice(0, 8) + "…"
                    : "Unassigned"}
                </span>
                <span
                  className={Classes.TEXT_MUTED}
                  style={{ fontSize: 11, minWidth: 60 }}
                >
                  {formatDate(task.due_date)}
                </span>
                <MiniProgressBar percent={task.progress_percent} />
                <Button
                  icon="edit"
                  small
                  minimal
                  onClick={() => startEdit(task)}
                  aria-label={`Edit task ${task.title}`}
                />
                <Button
                  icon="trash"
                  small
                  minimal
                  intent={Intent.DANGER}
                  onClick={() => remove(task.id)}
                  aria-label={`Delete task ${task.title}`}
                />
              </>
            )}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 8 }}>
        <Button
          small
          minimal
          icon="plus"
          text="Add task"
          onClick={() => setCreateOpen(true)}
        />
      </div>

      <TaskCreateDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultCampaignId={campaignId}
        defaultObjectiveIds={[objectiveId]}
      />
    </div>
  );
}
