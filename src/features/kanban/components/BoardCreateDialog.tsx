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
  Callout,
} from "@blueprintjs/core";
import { createBoard } from "../api/boardApi";

interface BoardCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId?: number;
  ownerId: number;
  onSuccess?: (boardId: number) => void;
}

const DEFAULT_COLUMNS = ["To Do", "In Progress", "Review", "Done"];

export default function BoardCreateDialog({
  isOpen,
  onClose,
  campaignId,
  ownerId,
  onSuccess,
}: BoardCreateDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = name.trim().length > 0;

  const handleClose = useCallback(() => {
    setName("");
    setDescription("");
    setError(null);
    onClose();
  }, [onClose]);

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);

    try {
      const key = name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const result = await createBoard({
        name: name.trim(),
        key: key || "BOARD",
        description: description.trim() || undefined,
        campaign_id: campaignId,
        owner_id: ownerId,
      });

      // Auto-scaffold default columns would be handled by backend
      // or via a separate API call. For now, we notify success.
      onSuccess?.(result.data.id);
      handleClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create board.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="New Board"
      icon="panel-table"
      style={{ width: 520 }}
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

        <FormGroup label="Board name" labelInfo="(required)">
          <InputGroup
            placeholder="e.g., Q2 Campaign Sprint"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Description">
          <TextArea
            fill
            rows={2}
            placeholder="What this board is for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>

        {campaignId && (
          <FormGroup label="Campaign">
            <InputGroup
              value={`Campaign ${campaignId}`}
              readOnly
              disabled
              leftIcon="briefcase"
            />
          </FormGroup>
        )}

        <div
          style={{
            padding: 12,
            background: "var(--cds-layer-01, #262626)",
            fontSize: 12,
            color: "var(--cds-text-secondary, #c6c6c6)",
          }}
        >
          <strong>Default columns will be created:</strong>{" "}
          {DEFAULT_COLUMNS.join(", ")}
        </div>
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} />
            <Button
              intent={Intent.PRIMARY}
              text="Create Board"
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
