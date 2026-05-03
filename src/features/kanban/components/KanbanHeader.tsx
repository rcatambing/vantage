import { Tag } from "@blueprintjs/core";
import { useKanban } from "../context/KanbanContext";
import BoardFilterBar from "./BoardFilterBar";
import type { BoardFilters } from "../types";

const MAX_AVATARS = 5;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface KanbanHeaderProps {
  filters: BoardFilters;
  onFiltersChange: (filters: BoardFilters) => void;
}

export default function KanbanHeader({ filters, onFiltersChange }: KanbanHeaderProps) {
  const { board } = useKanban();

  if (!board) return null;

  const visibleMembers = board.members.slice(0, MAX_AVATARS);
  const overflow = board.members.length - MAX_AVATARS;

  return (
    <div className="kanban-header">
      <div className="kanban-header-breadcrumb">
        <a href="#">Boards</a> / {board.name}
      </div>
      <div className="kanban-header-title">
        <h2>{board.name}</h2>
        <Tag minimal>{board.key}</Tag>
      </div>
      {board.description && (
        <p className="kanban-header-description">{board.description}</p>
      )}
      <div className="kanban-header-members">
        {visibleMembers.map((m) => (
          <span key={m.id} className="kanban-avatar" title={m.full_name}>
            {getInitials(m.full_name)}
          </span>
        ))}
        {overflow > 0 && (
          <span className="kanban-avatar kanban-avatar-overflow" title={`${overflow} more members`}>
            +{overflow}
          </span>
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <BoardFilterBar boardId={board.id} filters={filters} onChange={onFiltersChange} />
      </div>
    </div>
  );
}
