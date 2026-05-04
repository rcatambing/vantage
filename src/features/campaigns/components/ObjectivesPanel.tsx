import { useState } from "react";
import {
  Callout,
  Intent,
  Button,
  Collapse,
  Spinner,
  Classes,
} from "@blueprintjs/core";
import type { Objective, DiagnosticsResponse } from "../types";
import ObjectiveRow from "./ObjectiveRow";
import ObjectiveCreateDialog from "./ObjectiveCreateDialog";
import ObjectiveEmptyState from "./ObjectiveEmptyState";

interface Props {
  objectives: Objective[];
  diagnostics: DiagnosticsResponse | null;
  loading: boolean;
  error: string | null;
  campaignStatus: string;
  campaignId: number;
  onRefresh: () => void;
}

export default function ObjectivesPanel({
  objectives,
  diagnostics,
  loading,
  error,
  campaignStatus,
  campaignId,
  onRefresh,
}: Props) {
  const [orphansExpanded, setOrphansExpanded] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const orphanCount = diagnostics?.orphan_objectives.length ?? 0;
  const isTerminal = campaignStatus === "COMPLETED" || campaignStatus === "CANCELLED";

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
        <Spinner size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <Callout intent={Intent.DANGER} icon="error" title="Failed to load objectives">
        {error}
      </Callout>
    );
  }

  if (objectives.length === 0) {
    return (
      <div aria-live="polite">
        <ObjectiveEmptyState
          onAddClick={!isTerminal ? () => setAddOpen(true) : undefined}
          isTerminal={isTerminal}
        />
        {!isTerminal && (
          <ObjectiveCreateDialog
            isOpen={addOpen}
            campaignId={campaignId}
            onClose={() => setAddOpen(false)}
            onCreated={() => { setAddOpen(false); onRefresh(); }}
          />
        )}
      </div>
    );
  }

  return (
    <div aria-live="polite">
      {/* Add Objective button — hidden for terminal campaign states */}
      {!isTerminal && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Button
            icon="plus"
            intent={Intent.PRIMARY}
            text="Add Objective"
            small
            onClick={() => setAddOpen(true)}
          />
        </div>
      )}

      <ObjectiveCreateDialog
        isOpen={addOpen}
        campaignId={campaignId}
        onClose={() => setAddOpen(false)}
        onCreated={() => { setAddOpen(false); onRefresh(); }}
      />
      {/* BR-039: Orphan warning callout — count + collapsible list */}
      {orphanCount > 0 && (
        <Callout intent={Intent.WARNING} icon="warning-sign" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <strong>
              {orphanCount} objective{orphanCount > 1 ? "s have" : " has"} no tasks
              assigned and cannot make progress.
            </strong>
            <Button
              minimal
              small
              text={orphansExpanded ? "Hide details" : "Show details"}
              onClick={() => setOrphansExpanded(!orphansExpanded)}
            />
          </div>
          <Collapse isOpen={orphansExpanded}>
            <ul style={{ marginTop: 8, paddingLeft: 20, marginBottom: 0 }}>
              {diagnostics?.orphan_objectives.map((o) => (
                <li key={o.id} style={{ fontSize: 13 }}>
                  {o.title}
                  {o.status && (
                    <span className={Classes.TEXT_MUTED}> · {o.status}</span>
                  )}
                </li>
              ))}
            </ul>
          </Collapse>
        </Callout>
      )}

      {/* Overall progress summary */}
      {diagnostics && diagnostics.total_tasks > 0 && (
        <div
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 12, marginBottom: 12 }}
        >
          {diagnostics.completed_tasks}/{diagnostics.total_tasks} tasks complete ·{" "}
          {Math.round(diagnostics.overall_progress)}% overall progress
        </div>
      )}

      {/* Objective rows */}
      {objectives.map((obj) => (
        <ObjectiveRow
          key={obj.id}
          objective={obj}
          campaignStatus={campaignStatus}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
