import React, { useState } from "react";
import { Button, Classes, Dialog, DialogBody, DialogFooter, FormGroup, TagInput } from "@blueprintjs/core";
import { useApp } from "../../context/useApp";

interface ShareDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (recipients: readonly string[]) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [recipients, setRecipients] = useState<readonly string[]>([]);
  const { darkMode } = useApp();

  const toStrings = (vals: React.ReactNode[]): readonly string[] =>
    vals.filter((v): v is string => typeof v === "string");

  const handleSubmit = () => {
    onSubmit(recipients);
    setRecipients([]);
    onClose();
  };

  const handleClose = () => {
    setRecipients([]);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Share Post" icon="share" className={darkMode ? Classes.DARK : undefined}>
      <DialogBody>
        <FormGroup label="Share With" helperText="Type a user or group name and press Enter">
          <TagInput
            values={recipients}
            onChange={(vals) => setRecipients(toStrings(vals))}
            placeholder="Type a name or group and press Enter…"
            fill
          />
        </FormGroup>
      </DialogBody>
      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} />
            <Button
              text="Share"
              intent="primary"
              icon="share"
              onClick={handleSubmit}
              disabled={recipients.length === 0}
            />
          </>
        }
      />
    </Dialog>
  );
};

export default ShareDialog;
