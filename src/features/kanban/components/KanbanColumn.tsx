import { Button, Menu, MenuItem, Popover } from "@blueprintjs/core";
import { Droppable } from "@hello-pangea/dnd";
import type { BoardColumn, KanbanTask } from "../types";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  column: BoardColumn;
  onCardClick: (task: KanbanTask) => void;
  onAddTask: (columnId: number) => void;
}

export default function KanbanColumn({ column, onCardClick, onAddTask }: KanbanColumnProps) {
  const columnMenu = (
    <Menu>
      <MenuItem icon="edit" text="Rename column" />
      <MenuItem icon="trash" text="Delete column" intent="danger" />
    </Menu>
  );

  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h3 className="kanban-column-title">{column.title}</h3>
        <span className="kanban-column-count">{column.tasks.length}</span>
        <Popover content={columnMenu} placement="bottom-end" minimal>
          <Button icon="more" minimal small aria-label="Column actions" />
        </Popover>
      </div>

      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`kanban-column-cards${snapshot.isDraggingOver ? " kanban-column-droppable-over" : ""}`}
          >
            {column.tasks.map((task, idx) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={idx}
                onClick={() => onCardClick(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="kanban-column-footer">
        <Button
          icon="plus"
          text="Add a card"
          minimal
          small
          fill
          onClick={() => onAddTask(column.id)}
        />
      </div>
    </div>
  );
}
