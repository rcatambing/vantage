import { Icon } from "@blueprintjs/core";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useKanban } from "../context/KanbanContext";
import type { KanbanTask } from "../types";
import KanbanColumn from "./KanbanColumn";
import EmptyState from "./EmptyState";

interface KanbanBoardProps {
  onCardClick: (taskId: string) => void;
  onRequestCreate: (columnId: number) => void;
}

export default function KanbanBoard({ onCardClick, onRequestCreate }: KanbanBoardProps) {
  const { board, moveTask, addColumn } = useKanban();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // Dropped in the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const fromColumnId = Number(source.droppableId);
    const toColumnId = Number(destination.droppableId);

    moveTask(draggableId, fromColumnId, toColumnId, destination.index);
  };

  const handleAddColumn = () => {
    if (!board) return;
    const newId = Math.max(0, ...board.columns.map((c) => c.id)) + 1;
    addColumn({
      id: newId,
      title: `Column ${newId}`,
      order_index: board.columns.length,
      tasks: [],
    });
  };

  const handleAddTask = (columnId: number) => {
    onRequestCreate(columnId);
  };

  if (!board) {
    return <EmptyState title="No board loaded" description="Select or create a board to get started." icon="panel-table" />;
  }

  if (board.columns.length === 0) {
    return (
      <div className="kanban-board">
        <EmptyState title="No columns yet" description="Add a column to start organizing tasks." icon="column-layout" />
        <button className="kanban-add-column" onClick={handleAddColumn} type="button">
          <Icon icon="plus" style={{ marginRight: 6 }} />
          Add column
        </button>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {board.columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onCardClick={(task: KanbanTask) => onCardClick(task.id)}
            onAddTask={handleAddTask}
          />
        ))}
        <button className="kanban-add-column" onClick={handleAddColumn} type="button">
          <Icon icon="plus" style={{ marginRight: 6 }} />
          Add column
        </button>
      </div>
    </DragDropContext>
  );
}
