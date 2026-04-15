import { useState, useCallback } from "react";
import {
  Button,
  Callout,
  Classes,
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  Intent,
  TextArea,
} from "@blueprintjs/core";
import OfficeSuggest from "../../../components/suggest/OfficeSuggest";
import { useResourceAssignmentMutations } from "../hooks/useResourceAssignmentMutations";
import { appToaster } from "../../../toaster";
import type { ResourceAssignmentSummary } from "../types";

interface Props {
  isOpen: boolean;
  resourceId: string;
  currentOffice: ResourceAssignmentSummary;
  onClose: () => void;
  onReassigned: () => void;
}

export function ReassignResourceDialog({
  isOpen,
  resourceId,
  currentOffice,
  onClose,
  onReassigned,
}: Props) {
  const { reassign, submitting, error, clearError } = useResourceAssignmentMutations();

  const [targetOfficeId, setTargetOfficeId] = useState("");
  const [notes, setNotes] = useState("");

  const handleClose = useCallback(() => {
    setTargetOfficeId("");
    setNotes("");
    clearError();
    onClose();
  }, [onClose, clearError]);

  const handleSubmit = async () => {
    if (!targetOfficeId.trim()) return;
    const result = await reassign(resourceId, {
      target_office_id: targetOfficeId.trim(),
      notes: notes.trim() || undefined,
    });
    if (result) {
      const toaster = await appToaster;
      toaster.show({
        message: "Resource transferred successfully.",
        intent: Intent.SUCCESS,
        icon: "tick",
        timeout: 4000,
      });
      onReassigned();
      handleClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Transfer Resource"
      icon="swap-horizontal"
      style={{ width: 440 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        <Callout intent={Intent.PRIMARY} icon="info-sign" style={{ marginBottom: 16 }}>
          Currently assigned to <strong>{currentOffice.office_name}</strong>
        </Callout>

        <FormGroup label="Target Office" labelInfo="(required)">
          <OfficeSuggest
            selectedId={targetOfficeId}
            onSelect={setTargetOfficeId}
            excludeIds={[currentOffice.office_id]}
          />
        </FormGroup>

        <FormGroup label="Notes">
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes about this transfer…"
            fill
            rows={2}
          />
        </FormGroup>
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} className={Classes.DIALOG_CLOSE_BUTTON} />
            <Button
              intent={Intent.PRIMARY}
              text="Transfer"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!targetOfficeId.trim() || submitting}
            />
          </>
        }
      />
    </Dialog>
  );
}
