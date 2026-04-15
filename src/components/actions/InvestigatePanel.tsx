import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormGroup,
  HTMLSelect,
  InputGroup,
  TagInput,
  TextArea,
} from "@blueprintjs/core";
import { type InvestigateFormState, type StatusUpdateFrequency } from "./ActionTypes";

interface InvestigatePanelProps {
  readonly onClose: () => void;
  readonly onSubmit?: (state: InvestigateFormState) => void;
}

const STATUS_FREQUENCY_OPTIONS: Array<{ label: string; value: StatusUpdateFrequency }> = [
  { label: "Daily", value: "daily" },
  { label: "Every Other Day", value: "every-other-day" },
  { label: "Weekly", value: "weekly" },
  { label: "Bi-Weekly", value: "bi-weekly" },
];

const InvestigatePanel: React.FC<InvestigatePanelProps> = ({ onClose, onSubmit }) => {
  const [assign, setAssign] = useState<readonly string[]>([]);
  const [watchers, setWatchers] = useState<readonly string[]>([]);
  const [statusUpdateEnabled, setStatusUpdateEnabled] = useState(false);
  const [statusUpdateFrequency, setStatusUpdateFrequency] = useState<StatusUpdateFrequency>("weekly");
  const [targetDate, setTargetDate] = useState("");
  const [instructions, setInstructions] = useState("");

  const toStrings = (vals: React.ReactNode[]): readonly string[] =>
    vals.filter((v): v is string => typeof v === "string");

  const handleSubmit = () => {
    onSubmit?.({ assign, watchers, statusUpdateEnabled, statusUpdateFrequency, targetDate, instructions });
    onClose();
  };

  return (
    <>

      <FormGroup label="Assign To">
        <TagInput
          values={assign}
          onChange={(vals) => setAssign(toStrings(vals))}
          placeholder="Type a name or group and press Enter…"
          fill
        />
      </FormGroup>

      <FormGroup label="Watchers">
        <TagInput
          values={watchers}
          onChange={(vals) => setWatchers(toStrings(vals))}
          placeholder="Type a name or group and press Enter…"
          fill
        />
      </FormGroup>

      <FormGroup label="Status Update Schedule">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Checkbox
            checked={statusUpdateEnabled}
            onChange={(e) => setStatusUpdateEnabled(e.currentTarget.checked)}
            label="Enable periodic status updates"
            style={{ marginBottom: 0 }}
          />
          {statusUpdateEnabled && (
            <HTMLSelect
              value={statusUpdateFrequency}
              onChange={(e) =>
                setStatusUpdateFrequency(e.currentTarget.value as StatusUpdateFrequency)
              }
              options={STATUS_FREQUENCY_OPTIONS}
              minimal
            />
          )}
        </div>
      </FormGroup>

      <FormGroup label="Target Date">
        <InputGroup
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.currentTarget.value)}
        />
      </FormGroup>

      <FormGroup label="Instructions">
        <TextArea
          value={instructions}
          onChange={(e) => setInstructions(e.currentTarget.value)}
          placeholder="Enter instructions for the assignee…"
          fill
          rows={3}
        />
      </FormGroup>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <Button text="Cancel" onClick={onClose} />
        <Button text="Create Task" intent="primary" icon="tick" onClick={handleSubmit} />
      </div>
    </>
  );
};

export default InvestigatePanel;
