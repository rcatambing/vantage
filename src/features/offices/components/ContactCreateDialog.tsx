import { useState, useCallback } from "react";
import {
  Button,
  Callout,
  Classes,
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  HTMLSelect,
  InputGroup,
  Intent,
  Switch,
} from "@blueprintjs/core";
import { useOfficeContactMutations } from "../hooks/useOfficeContactMutations";
import type { ContactChannelType } from "../types";

const CONTACT_TYPE_OPTIONS: { value: ContactChannelType; label: string }[] = [
  { value: "PHONE", label: "Phone" },
  { value: "MOBILE", label: "Mobile" },
  { value: "EMAIL", label: "Email" },
  { value: "WEBSITE", label: "Website" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "X_TWITTER", label: "X (Twitter)" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "OTHER", label: "Other" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  officeId: string;
  onCreated: () => void;
}

export function ContactCreateDialog({ isOpen, onClose, officeId, onCreated }: Props) {
  const { create, submitting, error, clearError } = useOfficeContactMutations();

  const [contactType, setContactType] = useState<ContactChannelType>("PHONE");
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const handleClose = useCallback(() => {
    setContactType("PHONE");
    setValue("");
    setLabel("");
    setIsPrimary(false);
    clearError();
    onClose();
  }, [onClose, clearError]);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    const result = await create(officeId, {
      contact_type: contactType,
      value: value.trim(),
      label: label.trim() || undefined,
      is_primary: isPrimary,
    });
    if (result) {
      onCreated();
      handleClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Contact"
      icon="phone"
      style={{ width: 440 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="Contact Type" labelInfo="(required)">
          <HTMLSelect
            value={contactType}
            onChange={(e) => setContactType(e.target.value as ContactChannelType)}
            options={CONTACT_TYPE_OPTIONS}
            fill
          />
        </FormGroup>

        <FormGroup label="Value" labelInfo="(required)">
          <InputGroup
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. +63 2 8123 4567"
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Label">
          <InputGroup
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Main Line, General Inquiries"
          />
        </FormGroup>

        <Switch
          label="Set as primary contact"
          checked={isPrimary}
          onChange={(e) => setIsPrimary((e.target as HTMLInputElement).checked)}
        />
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} className={Classes.DIALOG_CLOSE_BUTTON} />
            <Button
              intent={Intent.PRIMARY}
              text="Add Contact"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!value.trim() || submitting}
            />
          </>
        }
      />
    </Dialog>
  );
}
