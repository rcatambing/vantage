import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { NonIdealState, Button, Spinner } from "@blueprintjs/core";
import { KanbanProvider, useKanban } from "../context/KanbanContext";
import { createDemoBoard } from "../data/demoBoard";
import { fetchBoard } from "../api/boardApi";
import KanbanHeader from "./KanbanHeader";
import FilteredKanbanBoard from "./FilteredKanbanBoard";
import KanbanCardDetail from "./KanbanCardDetail";
import BoardCreateDialog from "./BoardCreateDialog";
import type { Board, BoardFilters } from "../types";
import "../kanban.css";

/** Inner component that can access KanbanContext */
function KanbanPageInner({ campaignId }: { campaignId?: string }) {
  const { board } = useKanban();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [pendingColumnId, setPendingColumnId] = useState<number | null>(null);
  const [filters, setFilters] = useState<BoardFilters>({});
  const [createOpen, setCreateOpen] = useState(false);

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

  // No board state
  if (!board) {
    return (
      <div className="kanban-page" style={{ padding: 40 }}>
        <NonIdealState
          icon="panel-table"
          title="No board selected"
          description={
            campaignId
              ? "This campaign does not have a kanban board yet."
              : "Select or create a board to get started."
          }
          action={
            <Button
              intent="primary"
              icon="plus"
              text="Create Board"
              onClick={() => setCreateOpen(true)}
            />
          }
        />
        <BoardCreateDialog
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          campaignId={campaignId ? Number(campaignId) : undefined}
          ownerId={1}
        />
      </div>
    );
  }

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
      <BoardCreateDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        campaignId={campaignId ? Number(campaignId) : undefined}
        ownerId={1}
      />
    </div>
  );
}

export default function KanbanPage() {
  const { campaignId, boardId } = useParams<{ campaignId?: string; boardId?: string }>();
  const [loading, setLoading] = useState(false);
  const [initialBoard, setInitialBoard] = useState<Board | null>(null);

  useEffect(() => {
    const id = boardId ? Number(boardId) : undefined;
    if (!id) {
      setInitialBoard(createDemoBoard());
      return;
    }
    setLoading(true);
    fetchBoard(id)
      .then((b) => setInitialBoard(b))
      .catch(() => setInitialBoard(createDemoBoard()))
      .finally(() => setLoading(false));
  }, [boardId]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <KanbanProvider initialBoard={initialBoard}>
      <KanbanPageInner campaignId={campaignId} />
    </KanbanProvider>
  );
}
