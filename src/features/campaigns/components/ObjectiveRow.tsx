import { useState } from "react";
import {
  Tag,
  Intent,
  Button,
  MenuDivider,
  MenuItem,
  Popover,
  Menu,
  Alert,
  Classes,
} from "@blueprintjs/core";
import type { Objective, ObjectiveStatus } from "../types";
import { OBJECTIVE_STATUS_INTENT, OBJECTIVE_STATUS_LABEL } from "../types";
import ObjectiveProgressBar from "./ObjectiveProgressBar";
import ObjectiveWarningBadge from "./ObjectiveWarningBadge";
import { updateObjectiveStatus } from "../api/campaignApi";

interface Props {
  objective: Objective;
  /** Parent campaign status — controls which actions are available (BR-040) */
  campaignStatus: string;
  onRefresh: () => void;
}

export default function ObjectiveRow({ objective, campaignStatus, onRefresh }: Props) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // BR-040: Objective menu is hidden when the campaign is ON_HOLD, COMPLETED, or CANCELLED
  const menuVisible = !["ON_HOLD", "COMPLETED", "CANCELLED"].includes(campaignStatus);
  const canBlock =
    menuVisible && ["NOT_STARTED", "IN_PROGRESS"].includes(objective.objective_status);
  const canUnblock = menuVisible && objective.objective_status === "BLOCKED";
  const canCancel =
    menuVisible &&
    ["NOT_STARTED", "IN_PROGRESS", "BLOCKED"].includes(objective.objective_status);
  const showMenu = canBlock || canUnblock || canCancel;

  const handleStatusChange = async (newStatus: ObjectiveStatus) => {
    setLoading(true);
    try {
      await updateObjectiveStatus(objective.id, newStatus);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 4px",
        borderBottom: "1px solid var(--cds-border-subtle)",
      }}
    >
      {/* Status tag */}
      <Tag
        minimal
        intent={OBJECTIVE_STATUS_INTENT[objective.objective_status] ?? Intent.NONE}
        style={{ minWidth: 96, textAlign: "center", flexShrink: 0 }}
      >
        {OBJECTIVE_STATUS_LABEL[objective.objective_status] ??
          objective.objective_status}
      </Tag>

      {/* Title + code */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{objective.title}</div>
        {objective.objective_code && (
          <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
            {objective.objective_code}
          </div>
        )}
      </div>

      {/* Progress bar + stats */}
      <div style={{ width: 160, flexShrink: 0 }}>
        <ObjectiveProgressBar value={objective.progress} />
        <div
          className={Classes.TEXT_MUTED}
          style={{ fontSize: 11, textAlign: "center", marginTop: 2 }}
        >
          {objective.completed_task_count}/{objective.task_count} tasks ·{" "}
          {Math.round(objective.progress)}%
        </div>
      </div>

      {/* Orphan badge (BR-024) */}
      <ObjectiveWarningBadge is_orphan={objective.is_orphan} />

      {/* Overflow menu (BR-040) */}
      {showMenu && (
        <Popover
          content={
            <Menu>
              {canBlock && (
                <MenuItem
                  icon="blocked-person"
                  text="Mark as Blocked"
                  onClick={() => handleStatusChange("BLOCKED")}
                />
              )}
              {canUnblock && (
                <MenuItem
                  icon="unlock"
                  text="Unblock"
                  onClick={() => handleStatusChange("IN_PROGRESS")}
                />
              )}
              {canCancel && (
                <>
                  <MenuDivider />
                  <MenuItem
                    icon="cross"
                    text="Cancel Objective"
                    intent={Intent.DANGER}
                    onClick={() => setCancelOpen(true)}
                  />
                </>
              )}
            </Menu>
          }
          placement="bottom-end"
        >
          <Button icon="more" minimal small loading={loading} />
        </Popover>
      )}

      {/* Cancel confirmation dialog */}
      <Alert
        isOpen={cancelOpen}
        intent={Intent.DANGER}
        icon="trash"
        confirmButtonText="Cancel Objective"
        cancelButtonText="Keep"
        onConfirm={() => {
          setCancelOpen(false);
          handleStatusChange("CANCELLED");
        }}
        onCancel={() => setCancelOpen(false)}
      >
        Cancel objective <strong>{objective.title}</strong>? This will mark it as
        cancelled and cannot be easily undone.
      </Alert>
    </div>
  );
}
