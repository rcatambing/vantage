import React, { useState } from "react";
import { Button, FormGroup, HTMLSelect, TagInput, TextArea } from "@blueprintjs/core";
import { type TaskPersonnelFormState, type TaskPriority } from "./ActionTypes";

interface TaskPersonnelPanelProps {
  readonly onClose: () => void;
  readonly onSubmit?: (state: TaskPersonnelFormState) => void;
}

const PRIORITY_OPTIONS: Array<{ label: string; value: TaskPriority }> = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const TaskPersonnelPanel: React.FC<TaskPersonnelPanelProps> = ({ onClose, onSubmit }) => {
  const [assign, setAssign] = useState<readonly string[]>([]);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [instructions, setInstructions] = useState("");

  const toStrings = (vals: React.ReactNode[]): readonly string[] =>
    vals.filter((v): v is string => typeof v === "string");

  const handleSubmit = () => {
    onSubmit?.({ assign, priority, instructions });
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

      <FormGroup label="Priority">
        <HTMLSelect
          value={priority}
          onChange={(e) => setPriority(e.currentTarget.value as TaskPriority)}
          options={PRIORITY_OPTIONS}
          fill
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
        <Button text="Assign Task" intent="primary" icon="person" onClick={handleSubmit} />
      </div>
    </>
  );
};

export default TaskPersonnelPanel;
