import { useState, useCallback } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  FormGroup,
  InputGroup,
  TextArea,
  NumericInput,
  Callout,
  Classes,
} from "@blueprintjs/core";
import { createObjective } from "../api/campaignApi";
import { appToaster } from "../../../toaster";

interface Props {
  isOpen: boolean;
  campaignId: number;
  onClose: () => void;
  onCreated: () => void;
}

export default function ObjectiveCreateDialog({
  isOpen,
  campaignId,
  onClose,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number>(5);
  const [targetDate, setTargetDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setTitle("");
    setDescription("");
    setPriority(5);
    setTargetDate("");
    setError(null);
    setTitleError(null);
    onClose();
  }, [onClose]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError("Title is required.");
      return;
    }
    setTitleError(null);
    setSubmitting(true);
    setError(null);
    try {
      await createObjective({
        title: title.trim(),
        description: description.trim() || undefined,
        campaign_id: campaignId,
        priority,
        target_date: targetDate || undefined,
      });
      const toaster = await appToaster;
      toaster.show({
        message: "Objective added successfully.",
        intent: Intent.SUCCESS,
        icon: "tick",
        timeout: 4000,
      });
      handleClose();
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create objective");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Objective"
      icon="flag"
      style={{ width: 520 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        <FormGroup
          label="Title"
          labelInfo="(required)"
          helperText={titleError ?? undefined}
          intent={titleError ? Intent.DANGER : Intent.NONE}
        >
          <InputGroup
            placeholder="e.g. Register 5,000 new voters in Region III"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError && e.target.value.trim()) setTitleError(null);
            }}
            intent={titleError ? Intent.DANGER : Intent.NONE}
            maxLength={255}
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Description" labelInfo="(optional)">
          <TextArea
            fill
            rows={3}
            placeholder="Describe what success looks like for this objective..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={5000}
          />
        </FormGroup>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormGroup label="Priority" labelInfo="(1–10)">
            <NumericInput
              fill
              min={1}
              max={10}
              value={priority}
              onValueChange={(val) => setPriority(isNaN(val) ? 5 : val)}
              clampValueOnBlur
            />
          </FormGroup>

          <FormGroup label="Target Date" labelInfo="(optional)">
            <InputGroup
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              leftIcon="calendar"
            />
          </FormGroup>
        </div>

        <p className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginTop: 4, marginBottom: 0 }}>
          Tasks can be added to this objective after it is created.
        </p>
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} disabled={submitting} />
            <Button
              text="Add Objective"
              intent={Intent.PRIMARY}
              onClick={handleSubmit}
              loading={submitting}
            />
          </>
        }
      />
    </Dialog>
  );
}
