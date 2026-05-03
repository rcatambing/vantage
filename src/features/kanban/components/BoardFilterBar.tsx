import { useState, useEffect, useCallback } from "react";
import {
  ControlGroup,
  HTMLSelect,
  Checkbox,
  Button,
  InputGroup,
} from "@blueprintjs/core";

export interface BoardFilters {
  assignee_id?: string;
  severity?: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  ticket_type?: "TASK" | "INCIDENT" | "REQUEST";
  sla_breached?: boolean;
  due_before?: string;
}

interface Props {
  boardId: number;
  filters: BoardFilters;
  onChange: (filters: BoardFilters) => void;
}

const SEVERITY_OPTIONS = [
  { value: "", label: "All Severities" },
  { value: "LOW", label: "Low" },
  { value: "MODERATE", label: "Moderate" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "TASK", label: "Task" },
  { value: "INCIDENT", label: "Incident" },
  { value: "REQUEST", label: "Request" },
];

function getStorageKey(boardId: number): string {
  return `kanban_filters_${boardId}`;
}

export default function BoardFilterBar({ boardId, filters, onChange }: Props) {
  // Load persisted filters on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(getStorageKey(boardId));
      if (raw) {
        const parsed = JSON.parse(raw) as BoardFilters;
        onChange(parsed);
      }
    } catch {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  // Persist filters on change
  useEffect(() => {
    try {
      sessionStorage.setItem(getStorageKey(boardId), JSON.stringify(filters));
    } catch {
      // ignore storage errors
    }
  }, [boardId, filters]);

  const handleClear = useCallback(() => {
    onChange({});
    try {
      sessionStorage.removeItem(getStorageKey(boardId));
    } catch {
      // ignore
    }
  }, [boardId, onChange]);

  const hasFilters =
    filters.assignee_id ||
    filters.severity ||
    filters.ticket_type ||
    filters.sla_breached ||
    filters.due_before;

  return (
    <ControlGroup fill={false} style={{ gap: 8, flexWrap: "wrap" }}>
      <InputGroup
        placeholder="Assignee ID…"
        value={filters.assignee_id ?? ""}
        onChange={(e) =>
          onChange({ ...filters, assignee_id: e.target.value || undefined })
        }
        leftIcon="user"
        small
        style={{ width: 160 }}
      />
      <HTMLSelect
        small
        value={filters.ticket_type ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            ticket_type: (e.target.value as BoardFilters["ticket_type"]) || undefined,
          })
        }
        options={TYPE_OPTIONS}
        style={{ width: 140 }}
      />
      <HTMLSelect
        small
        value={filters.severity ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            severity: (e.target.value as BoardFilters["severity"]) || undefined,
          })
        }
        options={SEVERITY_OPTIONS}
        style={{ width: 150 }}
      />
      <Checkbox
        small
        checked={filters.sla_breached ?? false}
        onChange={(e) =>
          onChange({
            ...filters,
            sla_breached: e.target.checked || undefined,
          })
        }
        label="SLA Breached"
        style={{ margin: "0 8px" }}
      />
      <InputGroup
        type="date"
        small
        placeholder="Due before…"
        value={filters.due_before ?? ""}
        onChange={(e) =>
          onChange({ ...filters, due_before: e.target.value || undefined })
        }
        leftIcon="calendar"
        style={{ width: 150 }}
      />
      {hasFilters && (
        <Button small minimal icon="filter-remove" text="Clear" onClick={handleClear} />
      )}
    </ControlGroup>
  );
}
