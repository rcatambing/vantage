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

interface Props {
  isOpen: boolean;
  resourceId: string;
  onClose: () => void;
  onAssigned: () => void;
}

export function AssignResourceDialog({ isOpen, resourceId, onClose, onAssigned }: Props) {
  const { assign, submitting, error, clearError } = useResourceAssignmentMutations();

  const [officeId, setOfficeId] = useState("");
  const [notes, setNotes] = useState("");

  const handleClose = useCallback(() => {
    setOfficeId("");
    setNotes("");
    clearError();
    onClose();
  }, [onClose, clearError]);

  const handleSubmit = async () => {
    if (!officeId.trim()) return;
    const result = await assign(resourceId, {
      office_id: officeId.trim(),
      notes: notes.trim() || undefined,
    });
    if (result) {
      const toaster = await appToaster;
      toaster.show({
        message: "Resource assigned successfully.",
        intent: Intent.SUCCESS,
        icon: "tick",
        timeout: 4000,
      });
      onAssigned();
      handleClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Assign Resource"
      icon="office"
      style={{ width: 400 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="Office" labelInfo="(required)">
          <OfficeSuggest
            selectedId={officeId}
            onSelect={setOfficeId}
          />
        </FormGroup>

        <FormGroup label="Notes">
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes about this assignment…"
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
              text="Assign"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!officeId.trim() || submitting}
            />
          </>
        }
      />
    </Dialog>
  );
}
