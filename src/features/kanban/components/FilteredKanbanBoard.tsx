import { useState, useMemo, useCallback } from "react";
import type { KanbanTask } from "../types";
import type { BoardFilters } from "./BoardFilterBar";
import KanbanBoard from "./KanbanBoard";

interface FilteredKanbanBoardProps {
  onCardClick: (taskId: string) => void;
  onRequestCreate: (columnId: number) => void;
  filters: BoardFilters;
}

function matchesFilters(task: KanbanTask, filters: BoardFilters): boolean {
  if (filters.assignee_id != null) {
    if (String(task.assignee_id) !== filters.assignee_id) return false;
  }
  if (filters.severity != null) {
    if (task.severity !== filters.severity) return false;
  }
  if (filters.ticket_type != null) {
    if (task.ticket_type !== filters.ticket_type) return false;
  }
  if (filters.sla_breached === true) {
    if (!task.sla_breached) return false;
  }
  if (filters.due_before != null) {
    if (!task.sla_due_at) return false;
    if (new Date(task.sla_due_at) > new Date(filters.due_before)) return false;
  }
  return true;
}

export default function FilteredKanbanBoard({
  onCardClick,
  onRequestCreate,
  filters,
}: FilteredKanbanBoardProps) {
  const [filterKey, setFilterKey] = useState(0);

  // Force re-render when filters change so the board re-evaluates
  useMemo(() => {
    setFilterKey((k) => k + 1);
  }, [filters]);

  const filterFn = useCallback(
    (task: KanbanTask) => matchesFilters(task, filters),
    [filters],
  );

  return (
    <div key={filterKey} style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
      <KanbanBoard
        onCardClick={onCardClick}
        onRequestCreate={onRequestCreate}
        filterFn={filterFn}
      />
    </div>
  );
}
