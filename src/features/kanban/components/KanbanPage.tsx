import { useState, useCallback } from "react";
import { KanbanProvider, useKanban } from "../context/KanbanContext";
import { createDemoBoard } from "../data/demoBoard";
import KanbanHeader from "./KanbanHeader";
import FilteredKanbanBoard from "./FilteredKanbanBoard";
import KanbanCardDetail from "./KanbanCardDetail";
import type { BoardFilters } from "../types";
import "../kanban.css";

/** Inner component that can access KanbanContext */
function KanbanPageInner() {
  const { board } = useKanban();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [pendingColumnId, setPendingColumnId] = useState<number | null>(null);
  const [filters, setFilters] = useState<BoardFilters>({});

  const handleCardClick = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
  }, []);

  const handleRequestCreate = useCallback((columnId: number) => {
    setPendingColumnId(columnId);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedTaskId(null);
    setPendingColumnId(null);
  }, []);

  // Derive selected task from board context so edits stay in sync
  const selectedTask = selectedTaskId && board
    ? board.columns.flatMap((c) => c.tasks).find((t) => t.id === selectedTaskId) ?? null
    : null;

  const isCreateOpen = pendingColumnId != null;
  const isEditOpen = selectedTask != null;

  return (
    <div className="kanban-page">
      <KanbanHeader filters={filters} onFiltersChange={setFilters} />
      <FilteredKanbanBoard
        onCardClick={handleCardClick}
        onRequestCreate={handleRequestCreate}
        filters={filters}
      />
      {/* Edit dialog */}
      <KanbanCardDetail
        task={selectedTask}
        isOpen={isEditOpen}
        onClose={handleCloseDetail}
        mode="edit"
      />
      {/* Create dialog */}
      <KanbanCardDetail
        task={null}
        isOpen={isCreateOpen}
        onClose={handleCloseDetail}
        mode="create"
        createColumnId={pendingColumnId}
      />
    </div>
  );
}

export default function KanbanPage() {
  return (
    <KanbanProvider initialBoard={createDemoBoard()}>
      <KanbanPageInner />
    </KanbanProvider>
  );
}
