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
  HTMLSelect,
  Callout,
  Classes,
} from "@blueprintjs/core";
import { useNavigate } from "react-router";
import type { TaskStatus, TaskPriority } from "../types";
import { useTaskMutations } from "../hooks/useTaskMutations";
import UserSuggest from "../../../components/suggest/UserSuggest";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultCampaignId?: string;
}

const STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "BLOCKED", label: "Blocked" },
];

const PRIORITY_OPTIONS = [
  { value: "NONE", label: "None" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

export default function TaskCreateDialog({
  isOpen,
  onClose,
  defaultCampaignId,
}: Props) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("NOT_STARTED");
  const [priority, setPriority] = useState<TaskPriority>("NONE");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const { create, submitting, error, clearErrors } = useTaskMutations({
    onSuccess: () => {
      handleClose();
    },
  });

  const isValid = title.trim().length > 0;

  const handleClose = useCallback(() => {
    setTitle("");
    setDescription("");
    setStatus("NOT_STARTED");
    setPriority("NONE");
    setDueDate("");
    setAssigneeId("");
    clearErrors();
    onClose();
  }, [onClose, clearErrors]);

  const handleSubmit = async () => {
    if (!isValid) return;

    const success = await create({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      campaign_id: defaultCampaignId ?? "",
      assignee_id: assigneeId || undefined,
      due_date: dueDate || undefined,
    });

    if (success) {
      navigate(`/campaigns/${defaultCampaignId}/tasks`);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="New Task"
      icon="clipboard"
      style={{ width: 600 }}
    >
      <DialogBody>
        {error && (
          <Callout
            intent={Intent.DANGER}
            icon="error"
            style={{ marginBottom: 16 }}
          >
            {error}
          </Callout>
        )}

        <FormGroup label="Title" labelInfo="(required)">
          <InputGroup
            placeholder="Brief summary of the task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Description">
          <TextArea
            fill
            rows={3}
            placeholder="Detailed description…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <FormGroup label="Status">
            <HTMLSelect
              fill
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              options={STATUS_OPTIONS}
            />
          </FormGroup>

          <FormGroup label="Priority">
            <HTMLSelect
              fill
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              options={PRIORITY_OPTIONS}
            />
          </FormGroup>
        </div>

        <FormGroup label="Assignee">
          <UserSuggest selectedId={assigneeId} onSelect={setAssigneeId} />
        </FormGroup>

        <FormGroup label="Due Date">
          <InputGroup
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            leftIcon="calendar"
          />
        </FormGroup>
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} />
            <Button
              intent={Intent.PRIMARY}
              text="Create Task"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!isValid}
            />
          </>
        }
      />
    </Dialog>
  );
}
