import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogBody, DialogFooter, Checkbox, Button, EditableText, HTMLSelect, InputGroup, TextArea } from "@blueprintjs/core";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { KanbanTask, TaskMilestone } from "../types";
import { useKanban } from "../context/KanbanContext";
import PriorityIcon from "./PriorityIcon";
import ProgressBar from "./ProgressBar";
import TaskCommentThread from "./TaskCommentThread";

export type CardDetailMode = "edit" | "create";

interface KanbanCardDetailProps {
  task: KanbanTask | null;
  isOpen: boolean;
  onClose: () => void;
  mode?: CardDetailMode;
  /** Column id for task creation */
  createColumnId?: number | null;
}

const INITIAL_MILESTONES: TaskMilestone[] = [
  { id: 1, title: "Research voter demographics", is_completed: true, task_id: "demo-1", created_at: "2026-03-28T10:00:00" },
  { id: 2, title: "Draft outreach plan", is_completed: false, task_id: "demo-1", created_at: "2026-03-28T10:00:00" },
  { id: 3, title: "Schedule volunteer training", is_completed: false, task_id: "demo-1", created_at: "2026-03-28T10:00:00" },
  { id: 4, title: "Print materials", is_completed: false, task_id: "demo-1", created_at: "2026-03-28T10:00:00" },
];

const PRIORITY_OPTIONS = [
  { value: "0", label: "None" },
  { value: "1", label: "Low" },
  { value: "2", label: "Medium" },
  { value: "3", label: "High" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function KanbanCardDetail({ task, isOpen, onClose, mode = "edit", createColumnId }: KanbanCardDetailProps) {
  const { board, updateTask, addTask } = useKanban();
  const [milestones, setMilestones] = useState<TaskMilestone[]>(INITIAL_MILESTONES);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");

  // Create-mode form state
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createPriority, setCreatePriority] = useState(0);

  const isCreate = mode === "create";

  // Reset create form when dialog opens/closes
  useEffect(() => {
    if (isOpen && isCreate) {
      setCreateTitle("");
      setCreateDescription("");
      setCreatePriority(0);
    }
    if (isOpen && !isCreate) {
      setEditingDescription(false);
    }
  }, [isOpen, isCreate]);

  const toggleMilestone = useCallback((id: number) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_completed: !m.is_completed } : m))
    );
  }, []);

  const addMilestone = useCallback(() => {
    const title = newMilestoneTitle.trim();
    if (!title) return;
    setMilestones((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        is_completed: false,
        task_id: task?.id ?? "",
        created_at: new Date().toISOString(),
      },
    ]);
    setNewMilestoneTitle("");
  }, [newMilestoneTitle, task?.id]);

  const handlePriorityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (isCreate) {
        setCreatePriority(Number(e.target.value));
        return;
      }
      if (!task) return;
      updateTask(task.id, { priority: Number(e.target.value) });
    },
    [task, updateTask, isCreate]
  );

  const handleTitleConfirm = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!task || !trimmed) return;
      updateTask(task.id, { title: trimmed });
    },
    [task, updateTask]
  );

  const handleDescriptionSave = useCallback(() => {
    if (!task) return;
    updateTask(task.id, { description: descriptionDraft || null });
    setEditingDescription(false);
  }, [task, updateTask, descriptionDraft]);

  const handleDescriptionEdit = useCallback(() => {
    setDescriptionDraft(task?.description ?? "");
    setEditingDescription(true);
  }, [task?.description]);

  const handleCreate = useCallback(() => {
    if (!board || createColumnId == null) return;
    const trimmedTitle = createTitle.trim();
    if (!trimmedTitle) return;
    const allTasks = board.columns.flatMap((c) => c.tasks);
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: trimmedTitle,
      description: createDescription.trim() || null,
      priority: createPriority,
      index: allTasks.length + 1,
      assignee_id: null,
      assignee: null,
      column_id: createColumnId,
      board_id: board.id,
      milestone_count: 0,
      milestone_completed: 0,
      progress_percent: 0,
      created_at: new Date().toISOString(),
    };
    addTask(createColumnId, newTask);
    onClose();
  }, [board, createColumnId, createTitle, createDescription, createPriority, addTask, onClose]);

  if (!isCreate && !task) return null;

  const completedCount = milestones.filter((m) => m.is_completed).length;
  const percent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
  const effectivePriority = isCreate ? createPriority : (task?.priority ?? 0);
  const currentColumn = isCreate
    ? board?.columns.find((c) => c.id === createColumnId)
    : board?.columns.find((c) => c.id === task!.column_id);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      className="kanban-detail"
      canOutsideClickClose={!isCreate}
      canEscapeKeyClose
    >
      <DialogBody>
        <div className="kanban-detail-body">
          {/* Main content */}
          <div className="kanban-detail-main">
            {isCreate ? (
              <InputGroup
                placeholder="Task title"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                large
                autoFocus
                className="kanban-detail-title-input"
              />
            ) : (
              <EditableText
                value={task!.title}
                onConfirm={handleTitleConfirm}
                className="kanban-detail-title kanban-detail-title-editable"
                placeholder="Task title"
                selectAllOnFocus
              />
            )}

            {/* Description */}
            <div className="kanban-detail-section">
              <div className="kanban-detail-section-header">
                <h4>Description</h4>
                {!isCreate && !editingDescription && (
                  <Button icon="edit" minimal small onClick={handleDescriptionEdit} aria-label="Edit description" />
                )}
              </div>
              {isCreate ? (
                <TextArea
                  placeholder="Add a description..."
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  fill
                  rows={4}
                  growVertically
                />
              ) : editingDescription ? (
                <div className="kanban-detail-description-edit">
                  <TextArea
                    value={descriptionDraft}
                    onChange={(e) => setDescriptionDraft(e.target.value)}
                    fill
                    rows={4}
                    growVertically
                    autoFocus
                  />
                  <div className="kanban-detail-description-actions">
                    <Button text="Save" intent="primary" small onClick={handleDescriptionSave} />
                    <Button text="Cancel" small minimal onClick={() => setEditingDescription(false)} />
                  </div>
                </div>
              ) : (
                <div className="kanban-detail-description" onClick={handleDescriptionEdit} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") handleDescriptionEdit(); }}>
                  {task!.description ? (
                    <Markdown remarkPlugins={[remarkGfm]}>{task!.description}</Markdown>
                  ) : (
                    <span style={{ opacity: 0.5, fontStyle: "italic" }}>Click to add a description...</span>
                  )}
                </div>
              )}
            </div>

            {/* Milestones — edit mode only */}
            {!isCreate && (
              <div className="kanban-detail-section">
                <h4>Milestones</h4>
                <ProgressBar
                  percent={percent}
                  milestoneCount={milestones.length}
                  milestoneCompleted={completedCount}
                />
                <ul className="kanban-milestone-list">
                  {milestones.map((m) => (
                    <li key={m.id} className={`kanban-milestone-item${m.is_completed ? " completed" : ""}`}>
                      <Checkbox
                        checked={m.is_completed}
                        onChange={() => toggleMilestone(m.id)}
                        label={m.title}
                      />
                    </li>
                  ))}
                </ul>
                <div className="kanban-milestone-add">
                  <InputGroup
                    placeholder="Add a milestone..."
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addMilestone();
                      }
                    }}
                    fill
                    small
                  />
                  <Button icon="plus" small onClick={addMilestone} disabled={!newMilestoneTitle.trim()} aria-label="Add milestone" />
                </div>
              </div>
            )}

            {/* Comments — edit mode only */}
            {!isCreate && (
              <div className="kanban-detail-section">
                <h4>Comments</h4>
                <TaskCommentThread taskId={task!.id} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="kanban-detail-sidebar">
            <div className="kanban-detail-field">
              <div className="kanban-detail-field-label">Status</div>
              <div>{currentColumn?.title ?? "Unknown"}</div>
            </div>

            <div className="kanban-detail-field">
              <div className="kanban-detail-field-label">Priority</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PriorityIcon priority={effectivePriority} />
                <HTMLSelect
                  value={String(effectivePriority)}
                  onChange={handlePriorityChange}
                  minimal
                  options={PRIORITY_OPTIONS}
                />
              </div>
            </div>

            {!isCreate && (
              <div className="kanban-detail-field">
                <div className="kanban-detail-field-label">Assignee</div>
                {task!.assignee ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="kanban-avatar">{getInitials(task!.assignee.full_name)}</span>
                    <span>{task!.assignee.full_name}</span>
                  </div>
                ) : (
                  <span style={{ opacity: 0.5 }}>Unassigned</span>
                )}
              </div>
            )}

            {!isCreate && (
              <div className="kanban-detail-field">
                <div className="kanban-detail-field-label">Created</div>
                <div>{new Date(task!.created_at).toLocaleDateString()}</div>
              </div>
            )}
          </div>
        </div>
      </DialogBody>
      {isCreate && (
        <DialogFooter
          actions={
            <>
              <Button text="Cancel" onClick={onClose} />
              <Button
                text="Create"
                intent="primary"
                icon="add"
                onClick={handleCreate}
                disabled={!createTitle.trim()}
              />
            </>
          }
        />
      )}
    </Dialog>
  );
}
