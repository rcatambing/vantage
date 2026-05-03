import { useState } from "react";
import {
  Button,
  Intent,
  Callout,
  Spinner,
  HTMLSelect,
  Switch,
  InputGroup,
  Classes,
} from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import TaskCompletionChart, { type SeriesVisibility } from "./components/TaskCompletionChart";
import TaskCompletionKpiRow from "./components/TaskCompletionKpiRow";
import { useM10TaskCompletion, type M10Filters } from "./hooks/useM10TaskCompletion";
import type { M10Granularity } from "./types";

const PANEL_ID = "m10-TCP";
const PANEL_NAME = "Task Completion Rate";

const GRANULARITIES: M10Granularity[] = ["day", "week", "month"];

function toDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultDates() {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 29);
  return {
    from_date: toDateInput(start),
    to_date: toDateInput(end),
  };
}

function parseCsvInput(value: string): string[] {
  return value
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

const LEGEND_ITEMS: { key: keyof SeriesVisibility; label: string; color: string; dash?: boolean }[] = [
  { key: "remaining", label: "Remaining", color: "#e0e0e0" },
  { key: "humanCompleted", label: "Human Completed", color: "var(--cds-interactive)" },
  { key: "forceClosed", label: "Force Closed", color: "#f1c21b", dash: true },
  { key: "idealPace", label: "Ideal Pace", color: "#6f6f6f", dash: true },
];

const DEFAULT_VISIBILITY: SeriesVisibility = {
  remaining: true,
  humanCompleted: true,
  forceClosed: true,
  idealPace: true,
};

interface Props {
  campaignId: string;
}

export default function TaskCompletionPanel({ campaignId }: Props) {
  const defaultDates = getDefaultDates();

  const [filters, setFilters] = useState<M10Filters>({
    granularity: "week",
    include_cancelled: false,
    from_date: defaultDates.from_date,
    to_date: defaultDates.to_date,
  });
  const [objectiveInput, setObjectiveInput] = useState("");
  const [assigneeInput, setAssigneeInput] = useState("");
  const [taskTypeInput, setTaskTypeInput] = useState("");
  const [visibility, setVisibility] = useState<SeriesVisibility>(DEFAULT_VISIBILITY);

  const { data, loading, error, refetch } = useM10TaskCompletion(campaignId, filters);

  const summary = data?.summary;
  const trend = data?.trend ?? [];

  const ariaLabel = summary
    ? `Task completion burndown. ${summary.total_scope_count} total tasks. ${summary.remaining_open_count} remaining. Headline rate: ${summary.headline_completion_rate?.toFixed(1) ?? "N/A"}%.`
    : "Task completion burndown chart loading.";

  function toggleSeries(key: keyof SeriesVisibility) {
    setVisibility((v) => ({ ...v, [key]: !v[key] }));
  }

  function handleApplyExtraFilters() {
    setFilters((f) => ({
      ...f,
      objective_id: objectiveInput.trim() || undefined,
      assignee: parseCsvInput(assigneeInput),
      task_type: parseCsvInput(taskTypeInput),
    }));
  }

  return (
    <Panel id={PANEL_ID} name={PANEL_NAME} size="large">
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>

        {/* ── Filter bar ── */}
        <div
          role="group"
          aria-label="Task completion filters"
          style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
        >
          <HTMLSelect
            aria-label="Granularity"
            value={filters.granularity ?? "week"}
            onChange={(e) =>
              setFilters((f) => ({ ...f, granularity: e.target.value as M10Granularity }))
            }
            style={{ fontSize: 12 }}
          >
            {GRANULARITIES.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </HTMLSelect>

          <InputGroup
            small
            placeholder="Objective ID"
            aria-label="Objective ID"
            value={objectiveInput}
            onChange={(e) => setObjectiveInput(e.target.value)}
            style={{ width: 132 }}
          />

          <InputGroup
            small
            placeholder="Assignee IDs (comma)"
            aria-label="Assignee IDs"
            value={assigneeInput}
            onChange={(e) => setAssigneeInput(e.target.value)}
            style={{ width: 170 }}
          />

          <InputGroup
            small
            placeholder="Task Types (comma)"
            aria-label="Task Types"
            value={taskTypeInput}
            onChange={(e) => setTaskTypeInput(e.target.value)}
            style={{ width: 170 }}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <input
              type="date"
              aria-label="From date"
              value={filters.from_date ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, from_date: e.target.value || undefined }))}
              style={{
                background: "var(--cds-field-01)",
                border: "1px solid var(--cds-border-subtle)",
                color: "var(--cds-text-primary)",
                padding: "2px 6px",
                fontSize: 12,
                borderRadius: 2,
              }}
            />
          </label>

          <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>→</span>

          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <input
              type="date"
              aria-label="To date"
              value={filters.to_date ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, to_date: e.target.value || undefined }))}
              style={{
                background: "var(--cds-field-01)",
                border: "1px solid var(--cds-border-subtle)",
                color: "var(--cds-text-primary)",
                padding: "2px 6px",
                fontSize: 12,
                borderRadius: 2,
              }}
            />
          </label>

          <Switch
            label="Include Cancelled"
            checked={filters.include_cancelled ?? false}
            onChange={(e) =>
              setFilters((f) => ({ ...f, include_cancelled: e.currentTarget.checked }))
            }
            style={{ margin: 0, fontSize: 12 }}
          />

          <Button
            icon="filter"
            minimal
            small
            text="Apply"
            aria-label="Apply objective, assignee, and task type filters"
            onClick={handleApplyExtraFilters}
          />

          <Button
            icon="refresh"
            minimal
            small
            aria-label="Refresh task completion data"
            onClick={refetch}
            style={{ marginLeft: "auto" }}
          />
        </div>

        {/* ── KPI Row ── */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
            <Spinner size={16} intent={Intent.PRIMARY} />
            <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>Loading…</span>
          </div>
        )}

        <div role="alert">
          {error && !loading && (
            <Callout intent={Intent.DANGER} icon="error" title="Failed to load task completion">
              {error}{" "}
              <Button minimal small text="Retry" onClick={refetch} />
            </Callout>
          )}
        </div>

        {!loading && !error && summary && summary.total_scope_count === 0 && (
          <Callout intent={Intent.NONE} icon="info-sign" title="No tasks in scope">
            No tasks match the current filters. Try widening the date range or removing filters.
            <Button minimal small text="Reset filters" style={{ marginTop: 6, display: "block" }}
              onClick={() => {
                const defaults = getDefaultDates();
                setObjectiveInput("");
                setAssigneeInput("");
                setTaskTypeInput("");
                setFilters({
                  granularity: "week",
                  include_cancelled: false,
                  from_date: defaults.from_date,
                  to_date: defaults.to_date,
                });
              }}
            />
          </Callout>
        )}

        {!loading && !error && summary && summary.total_scope_count > 0 && (
          <TaskCompletionKpiRow summary={summary} includeCancelled={filters.include_cancelled ?? false} />
        )}

        {/* ── Chart ── */}
        {!loading && !error && (
          <div>
            {/* Legend toggles */}
            <div
              role="group"
              aria-label="Chart series visibility"
              style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}
            >
              {LEGEND_ITEMS.filter(
                (item) => item.key !== "forceClosed" || (filters.include_cancelled ?? false)
              ).map((item) => (
                <button
                  key={item.key}
                  onClick={() => toggleSeries(item.key)}
                  aria-pressed={visibility[item.key]}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 4px",
                    borderRadius: 2,
                    opacity: visibility[item.key] ? 1 : 0.4,
                    color: "var(--cds-text-secondary)",
                    fontSize: 11,
                  }}
                >
                  <svg width={20} height={10} aria-hidden="true">
                    <line
                      x1={0} y1={5} x2={20} y2={5}
                      stroke={item.color}
                      strokeWidth={2}
                      strokeDasharray={item.dash ? "4 2" : undefined}
                    />
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>

            <TaskCompletionChart
              trend={trend}
              summary={summary ?? {
                total_scope_count: 0,
                remaining_open_count: 0,
                human_completed_count: 0,
                force_closed_count: 0,
                headline_completion_rate: null,
                human_completion_rate: null,
                force_closure_rate: null,
              }}
              includeCancelled={filters.include_cancelled ?? false}
              visibility={visibility}
              ariaLabel={ariaLabel}
            />
          </div>
        )}

        {/* ── Metadata footnote ── */}
        {data?.metadata && (
          <p className={Classes.TEXT_MUTED} style={{ fontSize: 11, margin: 0 }}>
            Metric M10 · {data.metadata.granularity} buckets ·{" "}
            {data.metadata.timezone} ·{" "}
            {data.metadata.from_date ?? "-"} – {data.metadata.to_date ?? "-"}
          </p>
        )}
      </div>
    </Panel>
  );
}
