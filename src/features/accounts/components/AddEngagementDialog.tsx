import { useState, useCallback } from "react";
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
  InputGroup,
} from "@blueprintjs/core";
import type { EngagementEventType, AddEngagementPayload } from "../types";
import { useEngagementMutations } from "../hooks/useEngagementMutations";

const EVENT_TYPE_OPTIONS: { value: EngagementEventType; label: string }[] = [
  { value: "MEETING", label: "Meeting" },
  { value: "COMMITMENT", label: "Commitment" },
  { value: "ISSUE", label: "Issue" },
  { value: "NOTE", label: "Note" },
];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  leaderId: string;
  onSuccess: () => void;
}

export function AddEngagementDialog({ isOpen, onClose, leaderId, onSuccess }: Props) {
  const { logEngagement, submitting, error, clearError } = useEngagementMutations();

  const [eventType, setEventType] = useState<EngagementEventType>("MEETING");
  const [description, setDescription] = useState("");
  const [occurredAt, setOccurredAt] = useState(todayISO());

  const isValid = description.trim().length > 0;

  const handleClose = useCallback(() => {
    clearError();
    setEventType("MEETING");
    setDescription("");
    setOccurredAt(todayISO());
    onClose();
  }, [onClose, clearError]);

  const handleSubmit = async () => {
    if (!isValid) return;
    const payload: AddEngagementPayload = {
      event_type: eventType,
      description: description.trim(),
      occurred_at: occurredAt || undefined,
    };
    const result = await logEngagement(leaderId, payload);
    if (result) {
      onSuccess();
      handleClose();
    }
  };

  return (
    <Dialog
      title="Log Engagement Event"
      isOpen={isOpen}
      onClose={handleClose}
      icon="annotation"
      style={{ width: 460 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 12, borderRadius: 0 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="Event Type" labelInfo="(required)" labelFor="eng-type">
          <HTMLSelect
            id="eng-type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as EngagementEventType)}
            options={EVENT_TYPE_OPTIONS}
            fill
          />
        </FormGroup>

        <FormGroup label="Description" labelInfo="(required)" labelFor="eng-desc">
          <TextArea
            id="eng-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fill
            rows={4}
            placeholder="What happened?"
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Date" labelFor="eng-date">
          <InputGroup
            id="eng-date"
            type="date"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
          />
        </FormGroup>
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button onClick={handleClose} disabled={submitting} style={{ borderRadius: 0 }}>
              Cancel
            </Button>
            <Button
              intent={Intent.PRIMARY}
              loading={submitting}
              disabled={!isValid || submitting}
              onClick={handleSubmit}
              style={{ borderRadius: 0 }}
            >
              Log Event
            </Button>
          </>
        }
      />
    </Dialog>
  );
}
