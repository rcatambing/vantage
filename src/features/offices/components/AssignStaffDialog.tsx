import { useState, useCallback } from "react";
import {
  Button,
  Callout,
  Classes,
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core";
import { useOfficeStaffMutations } from "../hooks/useOfficeStaffMutations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  officeId: string;
  onAssigned: () => void;
}

export function AssignStaffDialog({ isOpen, onClose, officeId, onAssigned }: Props) {
  const { assign, submitting, error, clearError } = useOfficeStaffMutations();

  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const handleClose = useCallback(() => {
    setUserId("");
    setRole("");
    clearError();
    onClose();
  }, [onClose, clearError]);

  const handleSubmit = async () => {
    if (!userId.trim()) return;
    const result = await assign(officeId, {
      user_id: userId.trim(),
      role: role.trim() || undefined,
    });
    if (result) {
      onAssigned();
      handleClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Assign Staff"
      icon="person"
      style={{ width: 400 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="User ID" labelInfo="(required)">
          <InputGroup
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User UUID"
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Role">
          <InputGroup
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Field Coordinator, Volunteer"
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
              disabled={!userId.trim() || submitting}
            />
          </>
        }
      />
    </Dialog>
  );
}
