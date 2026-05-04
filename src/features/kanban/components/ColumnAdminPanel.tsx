import { useState, useCallback } from "react";
import {
  Drawer,
  DrawerSize,
  Button,
  InputGroup,
  Tooltip,
  Icon,
} from "@blueprintjs/core";
import { useKanban } from "../context/KanbanContext";

interface ColumnAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ColumnAdminPanel({
  isOpen,
  onClose,
}: ColumnAdminPanelProps) {
  const { board, renameColumn, removeColumn, addColumn, reorderColumns } =
    useKanban();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const startEdit = useCallback((id: number, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  }, []);

  const commitEdit = useCallback(() => {
    if (editingId !== null && editTitle.trim()) {
      renameColumn(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  }, [editingId, editTitle, renameColumn]);

  const handleAdd = useCallback(() => {
    const title = newTitle.trim();
    if (!title || !board) return;
    const newId = Math.max(0, ...board.columns.map((c) => c.id)) + 1;
    addColumn({
      id: newId,
      title,
      order_index: board.columns.length,
      tasks: [],
    });
    setNewTitle("");
  }, [newTitle, board, addColumn]);

  const handleMoveUp = useCallback(
    (index: number) => {
      if (!board || index <= 0) return;
      const order = board.columns.map((c) => c.id);
      [order[index - 1], order[index]] = [order[index], order[index - 1]];
      reorderColumns(order);
    },
    [board, reorderColumns]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (!board || index >= board.columns.length - 1) return;
      const order = board.columns.map((c) => c.id);
      [order[index], order[index + 1]] = [order[index + 1], order[index]];
      reorderColumns(order);
    },
    [board, reorderColumns]
  );

  if (!board) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Column Settings"
      position="right"
      size={DrawerSize.SMALL}
      canOutsideClickClose
      canEscapeKeyClose
    >
      <div style={{ padding: 16 }}>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
          {board.columns.map((col, idx) => {
            const hasTasks = col.tasks.length > 0;
            return (
              <li
                key={col.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 0",
                  borderBottom: "1px solid var(--cds-border-subtle, #393939)",
                }}
              >
                <Button
                  icon="arrow-up"
                  minimal
                  small
                  disabled={idx === 0}
                  onClick={() => handleMoveUp(idx)}
                  aria-label={`Move ${col.title} up`}
                />
                <Button
                  icon="arrow-down"
                  minimal
                  small
                  disabled={idx === board.columns.length - 1}
                  onClick={() => handleMoveDown(idx)}
                  aria-label={`Move ${col.title} down`}
                />

                <Icon
                  icon="drag-handle-vertical"
                  size={14}
                  style={{
                    color: "var(--cds-text-secondary, #c6c6c6)",
                    cursor: "grab",
                  }}
                />

                {editingId === col.id ? (
                  <InputGroup
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    small
                    autoFocus
                    fill
                  />
                ) : (
                  <span
                    style={{ flex: 1, cursor: "pointer", fontSize: 13 }}
                    onClick={() => startEdit(col.id, col.title)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") startEdit(col.id, col.title);
                    }}
                  >
                    {col.title}
                  </span>
                )}

                <Tooltip
                  content={
                    hasTasks
                      ? "Cannot delete: column contains cards. Move or delete cards first."
                      : "Delete column"
                  }
                  placement="top"
                >
                  <Button
                    icon="trash"
                    minimal
                    small
                    intent="danger"
                    disabled={hasTasks}
                    onClick={() => removeColumn(col.id)}
                    aria-label={`Delete ${col.title}`}
                  />
                </Tooltip>
              </li>
            );
          })}
        </ul>

        <div style={{ display: "flex", gap: 8 }}>
          <InputGroup
            placeholder="New column name..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            fill
          />
          <Button
            icon="plus"
            intent="primary"
            onClick={handleAdd}
            disabled={!newTitle.trim()}
            aria-label="Add new column"
          >
            Add
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
