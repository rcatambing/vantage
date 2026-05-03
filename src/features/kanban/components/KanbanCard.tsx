import { Draggable } from "@hello-pangea/dnd";
import { Tag, Intent } from "@blueprintjs/core";
import type { KanbanTask } from "../types";
import PriorityIcon from "./PriorityIcon";
import ProgressBar from "./ProgressBar";
import SLABadge from "../../tickets/components/SLABadge";

interface KanbanCardProps {
  task: KanbanTask;
  index: number;
  onClick: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const SEVERITY_INTENT: Record<string, Intent> = {
  LOW: Intent.NONE,
  MODERATE: Intent.PRIMARY,
  HIGH: Intent.WARNING,
  CRITICAL: Intent.DANGER,
};

const TYPE_LABEL: Record<string, string> = {
  TASK: "Task",
  INCIDENT: "Incident",
  REQUEST: "Request",
};

export default function KanbanCard({ task, index, onClick }: KanbanCardProps) {
  const isTicket = task.ticket_type != null;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card${snapshot.isDragging ? " kanban-card-dragging" : ""}${task.sla_breached ? " kanban-card--sla-breached" : ""}`}
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick();
            }
          }}
        >
          <div className="kanban-card-top">
            <div className="kanban-card-priority">
              <PriorityIcon priority={task.priority} />
            </div>
            <p className="kanban-card-title">{task.title}</p>
            {task.assignee && (
              <div className="kanban-card-assignee">
                <span className="kanban-avatar" title={task.assignee.full_name}>
                  {getInitials(task.assignee.full_name)}
                </span>
              </div>
            )}
          </div>

          {/* Ticket metadata tags */}
          {isTicket && (
            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              {task.ticket_type && (
                <Tag minimal small>
                  {TYPE_LABEL[task.ticket_type] ?? task.ticket_type}
                </Tag>
              )}
              {task.severity && (
                <Tag intent={SEVERITY_INTENT[task.severity] ?? Intent.NONE} minimal small>
                  {task.severity}
                </Tag>
              )}
              {task.sla_due_at && (
                <SLABadge slaBreached={task.sla_breached ?? false} slaDueAt={task.sla_due_at} />
              )}
            </div>
          )}

          {task.milestone_count > 0 && (
            <div className="kanban-card-bottom">
              <ProgressBar
                percent={task.progress_percent}
                milestoneCount={task.milestone_count}
                milestoneCompleted={task.milestone_completed}
                compact
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
