import { Draggable } from "@hello-pangea/dnd";
import type { KanbanTask } from "../types";
import PriorityIcon from "./PriorityIcon";
import ProgressBar from "./ProgressBar";

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

export default function KanbanCard({ task, index, onClick }: KanbanCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card${snapshot.isDragging ? " kanban-card-dragging" : ""}`}
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
