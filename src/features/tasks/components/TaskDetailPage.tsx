import { useState } from "react";
import {
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Tag,
  Button,
  FormGroup,
  InputGroup,
  TextArea,
  HTMLSelect,
  Classes,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import type { TaskStatus, TaskPriority } from "../types";
import { useTask } from "../hooks/useTask";
import { useTaskMutations } from "../hooks/useTaskMutations";
import MilestoneChecklist from "./MilestoneChecklist";
import TaskCommentThread from "./TaskCommentThread";
import UserSuggest from "../../../components/suggest/UserSuggest";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "BLOCKED", label: "Blocked" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

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

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
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

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { task, loading, error, refetch } = useTask(id);
  const mutations = useTaskMutations({ onSuccess: refetch });

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<TaskStatus>("NOT_STARTED");
  const [editPriority, setEditPriority] = useState<TaskPriority>("NONE");
  const [editAssigneeId, setEditAssigneeId] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 80,
        }}
      >
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !task) {
    return (
      <NonIdealState
        icon="error"
        title="Task not found"
        description={error ?? "The requested task could not be loaded."}
        action={
          <Button text="Back to Tasks" onClick={() => navigate(-1)} />
        }
      />
    );
  }

  const startEditing = () => {
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setEditStatus(task.status);
    setEditPriority(task.priority);
    setEditAssigneeId(task.assignee_id ?? "");
    setEditDueDate(task.due_date ?? "");
    setEditing(true);
    mutations.clearErrors();
  };

  const cancelEditing = () => {
    setEditing(false);
    mutations.clearErrors();
  };

  const handleSave = async () => {
    const success = await mutations.update(task.id, {
      title: editTitle.trim() || undefined,
      description: editDescription.trim() || undefined,
      status: editStatus,
      priority: editPriority,
      assignee_id: editAssigneeId || undefined,
      due_date: editDueDate || undefined,
    });
    if (success) setEditing(false);
  };

  const handleDelete = async () => {
    const success = await mutations.remove(task.id);
    if (success) navigate(-1);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <Button
          minimal
          icon="arrow-left"
          text="Tasks"
          onClick={() => navigate(-1)}
        />
        <Tag intent={STATUS_INTENT[task.status]} minimal>
          {STATUS_LABEL[task.status]}
        </Tag>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {!editing && (
            <Button small icon="edit" text="Edit" onClick={startEditing} />
          )}
          {task.status !== "COMPLETED" && (
            <Button
              small
              icon="trash"
              intent={Intent.DANGER}
              text="Delete"
              onClick={handleDelete}
              loading={mutations.submitting}
            />
          )}
        </div>
      </div>

      {mutations.error && (
        <Callout
          intent={Intent.DANGER}
          icon="error"
          style={{ marginBottom: 16 }}
        >
          {mutations.error}
        </Callout>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        {/* Left panel */}
        <div>
          {editing ? (
            <>
              <FormGroup label="Title">
                <InputGroup
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </FormGroup>
              <FormGroup label="Description">
                <TextArea
                  fill
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </FormGroup>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <FormGroup label="Status">
                  <HTMLSelect
                    fill
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as TaskStatus)
                    }
                    options={STATUS_OPTIONS}
                  />
                </FormGroup>
                <FormGroup label="Priority">
                  <HTMLSelect
                    fill
                    value={editPriority}
                    onChange={(e) =>
                      setEditPriority(e.target.value as TaskPriority)
                    }
                    options={PRIORITY_OPTIONS}
                  />
                </FormGroup>
              </div>
              <FormGroup label="Assignee">
                <UserSuggest
                  selectedId={editAssigneeId}
                  onSelect={setEditAssigneeId}
                />
              </FormGroup>
              <FormGroup label="Due Date">
                <InputGroup
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  leftIcon="calendar"
                />
              </FormGroup>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <Button
                  intent={Intent.PRIMARY}
                  text="Save"
                  onClick={handleSave}
                  loading={mutations.submitting}
                />
                <Button text="Cancel" onClick={cancelEditing} />
              </div>
            </>
          ) : (
            <>
              <h2 style={{ margin: "0 0 12px", fontSize: 20, fontWeight: 600 }}>
                {task.title}
              </h2>
              {task.description && (
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    margin: "0 0 20px",
                    color: "var(--cds-text-secondary, #c6c6c6)",
                  }}
                >
                  {task.description}
                </p>
              )}

              {/* Milestones */}
              <section style={{ marginTop: 24 }}>
                <h4
                  className="bp5-heading"
                  style={{ fontSize: 14, marginBottom: 12 }}
                >
                  Milestones
                </h4>
                <MilestoneChecklist
                  taskId={task.id}
                  milestones={task.milestones}
                  onMutate={refetch}
                />
              </section>

              {/* Comments */}
              <section style={{ marginTop: 32 }}>
                <h4
                  className="bp5-heading"
                  style={{ fontSize: 14, marginBottom: 12 }}
                >
                  Comments
                </h4>
                <TaskCommentThread
                  taskId={task.id}
                  comments={task.comments}
                  onMutate={refetch}
                />
              </section>
            </>
          )}
        </div>

        {/* Right rail */}
        <div>
          <div
            style={{
              padding: 16,
              background: "var(--cds-layer-01, #262626)",
            }}
          >
            <h4
              className="bp5-heading"
              style={{ fontSize: 12, marginBottom: 12 }}
            >
              Details
            </h4>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                ASSIGNEE
              </div>
              <div style={{ fontSize: 13 }}>
                {task.assignee_id ?? (
                  <span className={Classes.TEXT_MUTED}>Unassigned</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                PRIORITY
              </div>
              <Tag intent={STATUS_INTENT[task.status]} minimal>
                {STATUS_LABEL[task.status]}
              </Tag>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                DUE DATE
              </div>
              <div style={{ fontSize: 13 }}>{formatDate(task.due_date)}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                START DATE
              </div>
              <div style={{ fontSize: 13 }}>
                {formatDate(task.start_date)}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                COMPLETED
              </div>
              <div style={{ fontSize: 13 }}>
                {formatDateTime(task.actual_completion)}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                CREATED
              </div>
              <div style={{ fontSize: 13 }}>
                {formatDateTime(task.created_at)}
              </div>
            </div>

            {task.updated_at && (
              <div style={{ marginBottom: 12 }}>
                <div
                  className={Classes.TEXT_MUTED}
                  style={{ fontSize: 11, marginBottom: 4 }}
                >
                  UPDATED
                </div>
                <div style={{ fontSize: 13 }}>
                  {formatDateTime(task.updated_at)}
                </div>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 8 }}
              >
                PROGRESS
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "var(--cds-border-subtle, #393939)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${task.progress_percent}%`,
                      height: "100%",
                      background:
                        task.progress_percent >= 80
                          ? "#24a148"
                          : task.progress_percent >= 40
                            ? "#0f62fe"
                            : "#f1c21b",
                      transition: "width 200ms ease",
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600 }}>
                  {task.progress_percent}%
                </span>
              </div>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginTop: 4 }}
              >
                {task.milestone_completed} of {task.milestone_count} milestones
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
