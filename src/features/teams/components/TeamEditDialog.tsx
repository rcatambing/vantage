import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  FormGroup,
  TextArea,
  HTMLSelect,
  Callout,
  Alert,
} from "@blueprintjs/core";
import type { Team, TeamStatus } from "../types";
import { updateTeam } from "../api/teamApi";
import { appToaster } from "../../../toaster";

interface Props {
  isOpen: boolean;
  team: Team;
  onClose: () => void;
  onUpdated: () => void;
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "DISSOLVED", label: "Dissolved" },
];

export default function TeamEditDialog({ isOpen, team, onClose, onUpdated }: Props) {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TeamStatus>("ACTIVE");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dissolveAlertOpen, setDissolveAlertOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDescription(team.description ?? "");
      setStatus(team.status);
      setError(null);
    }
  }, [isOpen, team]);

  const handleClose = useCallback(() => {
    setError(null);
    onClose();
  }, [onClose]);

  const doUpdate = async (payload: { description?: string; status?: TeamStatus }) => {
    setSubmitting(true);
    setError(null);
    try {
      await updateTeam(team.id, payload);
      const toaster = await appToaster;
      toaster.show({
        message: "Team updated successfully.",
        intent: Intent.SUCCESS,
        icon: "tick",
        timeout: 4000,
      });
      handleClose();
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update team");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const nextStatus = status;
    const nextDescription = description.trim();

    // BR-010: Dissolution guard — warn if linked to active campaigns
    if (
      nextStatus === "DISSOLVED" &&
      team.status === "ACTIVE" &&
      team.campaigns &&
      team.campaigns.length > 0
    ) {
      setDissolveAlertOpen(true);
      return;
    }

    await doUpdate({
      description: nextDescription || undefined,
      status: nextStatus,
    });
  };

  const confirmDissolve = async () => {
    setDissolveAlertOpen(false);
    await doUpdate({
      description: description.trim() || undefined,
      status: "DISSOLVED",
    });
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title="Edit Team"
        icon="edit"
        style={{ width: 480, borderRadius: 0 }}
      >
        <DialogBody>
          {error && (
            <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
              {error}
            </Callout>
          )}

          <FormGroup label="Description" labelInfo="(optional)">
            <TextArea
              fill
              rows={3}
              placeholder="Describe the team's purpose and operational scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup label="Status">
            <HTMLSelect
              fill
              value={status}
              onChange={(e) => setStatus(e.target.value as TeamStatus)}
              options={STATUS_OPTIONS}
              disabled={submitting}
            />
          </FormGroup>
        </DialogBody>

        <DialogFooter
          actions={
            <>
              <Button text="Cancel" onClick={handleClose} disabled={submitting} />
              <Button
                intent={Intent.PRIMARY}
                icon="tick"
                text="Save Changes"
                loading={submitting}
                onClick={() => void handleSubmit()}
              />
            </>
          }
        />
      </Dialog>

      <Alert
        isOpen={dissolveAlertOpen}
        onConfirm={() => void confirmDissolve()}
        onCancel={() => setDissolveAlertOpen(false)}
        confirmButtonText="Dissolve"
        cancelButtonText="Cancel"
        intent={Intent.DANGER}
        icon="warning-sign"
      >
        <p>
          This team is linked to {team.campaigns?.length ?? 0} active campaign
          {team.campaigns && team.campaigns.length !== 1 ? "s" : ""}. Dissolving it may
          affect ongoing operations. Are you sure?
        </p>
      </Alert>
    </>
  );
}
