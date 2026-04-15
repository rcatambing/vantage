import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Board, BoardColumn, KanbanTask } from "../types";

interface KanbanContextValue {
  board: Board | null;
  setBoard: (board: Board) => void;
  /** Move task to a new column at a given index (optimistic) */
  moveTask: (taskId: string, fromColumnId: number, toColumnId: number, toIndex: number) => void;
  /** Reorder columns */
  reorderColumns: (newOrder: number[]) => void;
  /** Add a column */
  addColumn: (column: BoardColumn) => void;
  /** Remove a column (only if empty) */
  removeColumn: (columnId: number) => void;
  /** Rename a column */
  renameColumn: (columnId: number, title: string) => void;
  /** Add a task to a column */
  addTask: (columnId: number, task: KanbanTask) => void;
  /** Update a task in place */
  updateTask: (taskId: string, updates: Partial<KanbanTask>) => void;
  /** Delete a task */
  deleteTask: (taskId: string) => void;
}

const KanbanContext = createContext<KanbanContextValue | null>(null);

export function KanbanProvider({ children, initialBoard }: { children: ReactNode; initialBoard: Board | null }) {
  const [board, setBoardState] = useState<Board | null>(initialBoard);

  const setBoard = useCallback((b: Board) => setBoardState(b), []);

  const moveTask = useCallback(
    (taskId: string, fromColumnId: number, toColumnId: number, toIndex: number) => {
      setBoardState((prev) => {
        if (!prev) return prev;
        const cols = prev.columns.map((c) => ({ ...c, tasks: [...c.tasks] }));
        const fromCol = cols.find((c) => c.id === fromColumnId);
        const toCol = cols.find((c) => c.id === toColumnId);
        if (!fromCol || !toCol) return prev;

        const taskIdx = fromCol.tasks.findIndex((t) => t.id === taskId);
        if (taskIdx === -1) return prev;

        const [task] = fromCol.tasks.splice(taskIdx, 1);
        const movedTask = { ...task, column_id: toColumnId, index: toIndex };
        toCol.tasks.splice(toIndex, 0, movedTask);

        // re-index
        fromCol.tasks.forEach((t, i) => (t.index = i));
        toCol.tasks.forEach((t, i) => (t.index = i));

        return { ...prev, columns: cols };
      });
    },
    []
  );

  const reorderColumns = useCallback((newOrder: number[]) => {
    setBoardState((prev) => {
      if (!prev) return prev;
      const colMap = new Map(prev.columns.map((c) => [c.id, c]));
      const reordered = newOrder
        .map((id, idx) => {
          const col = colMap.get(id);
          return col ? { ...col, order_index: idx } : null;
        })
        .filter(Boolean) as BoardColumn[];
      return { ...prev, columns: reordered };
    });
  }, []);

  const addColumn = useCallback((column: BoardColumn) => {
    setBoardState((prev) => {
      if (!prev) return prev;
      return { ...prev, columns: [...prev.columns, column] };
    });
  }, []);

  const removeColumn = useCallback((columnId: number) => {
    setBoardState((prev) => {
      if (!prev) return prev;
      return { ...prev, columns: prev.columns.filter((c) => c.id !== columnId) };
    });
  }, []);

  const renameColumn = useCallback((columnId: number, title: string) => {
    setBoardState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
      };
    });
  }, []);

  const addTask = useCallback((columnId: number, task: KanbanTask) => {
    setBoardState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((c) =>
          c.id === columnId ? { ...c, tasks: [...c.tasks, task] } : c
        ),
      };
    });
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setBoardState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((c) => ({
          ...c,
          tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
        })),
      };
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setBoardState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((c) => ({
          ...c,
          tasks: c.tasks.filter((t) => t.id !== taskId),
        })),
      };
    });
  }, []);

  return (
    <KanbanContext.Provider
      value={{
        board,
        setBoard,
        moveTask,
        reorderColumns,
        addColumn,
        removeColumn,
        renameColumn,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban(): KanbanContextValue {
  const ctx = useContext(KanbanContext);
  if (!ctx) throw new Error("useKanban must be used within KanbanProvider");
  return ctx;
}
