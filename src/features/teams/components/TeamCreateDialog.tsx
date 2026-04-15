import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  InputGroup,
  TextArea,
  HTMLSelect,
  Button,
  Intent,
  Callout,
  Spinner,
} from "@blueprintjs/core";
import { createTeam, getCampaigns } from "../api/teamApi";
import type { CampaignRef } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Called after the team is successfully created so the parent can refetch. */
  onCreated: () => void;
}

interface FormState {
  team_name: string;
  description: string;
  campaign_id: string;
}

const INITIAL_FORM: FormState = {
  team_name: "",
  description: "",
  campaign_id: "",
};

export default function TeamCreateDialog({ isOpen, onClose, onCreated }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState<CampaignRef[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Reset form state every time the dialog opens
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setFieldErrors({});
      setApiError(null);
    }
  }, [isOpen]);

  // Load campaign list for the optional initial-link select
  useEffect(() => {
    if (!isOpen) return;
    setLoadingCampaigns(true);
    getCampaigns()
      .then((res) => setCampaigns(res.items))
      .catch(() => {
        // Campaign list is optional — render with just the "None" option on failure
      })
      .finally(() => setLoadingCampaigns(false));
  }, [isOpen]);

  const validate = useCallback((): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    const name = form.team_name.trim();
    if (!name) {
      next.team_name = "Team name is required.";
    } else if (name.length > 255) {
      next.team_name = "Team name must be 255 characters or fewer.";
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }, [form.team_name]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      await createTeam({
        team_name: form.team_name.trim(),
        description: form.description.trim() || undefined,
        campaign_id: form.campaign_id || undefined,
      });
      onCreated();
      onClose();
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  }, [form, validate, onCreated, onClose]);

  // Allow Ctrl/Cmd+Enter to submit
  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      void handleSubmit();
    }
  }

  const hasNameError = Boolean(fieldErrors.team_name);

  const campaignOptions = [
    { value: "", label: "None — leave unlinked" },
    ...campaigns.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Team"
      icon="add"
      style={{ width: 480 }}
    >
      <DialogBody onKeyDown={handleKeyDown}>
        {apiError && (
          <Callout
            intent={Intent.DANGER}
            icon="error"
            style={{ marginBottom: 16 }}
          >
            {apiError}
          </Callout>
        )}

        <FormGroup
          label="Team Name"
          labelInfo="(required)"
          intent={hasNameError ? Intent.DANGER : Intent.NONE}
          helperText={fieldErrors.team_name}
        >
          <InputGroup
            placeholder="e.g. Field Team Alpha"
            value={form.team_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, team_name: e.target.value }))
            }
            intent={hasNameError ? Intent.DANGER : Intent.NONE}
            maxLength={255}
            autoFocus
            disabled={submitting}
          />
        </FormGroup>

        <FormGroup
          label="Description"
          helperText="Optional. Describe the team's purpose or operational scope."
        >
          <TextArea
            fill
            rows={3}
            placeholder="e.g. Responsible for ground canvassing in District 4 and 5."
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            disabled={submitting}
          />
        </FormGroup>

        <FormGroup
          label="Link to Campaign"
          helperText="Optional. The team can be linked to additional campaigns later."
        >
          {loadingCampaigns ? (
            <Spinner size={16} />
          ) : (
            <HTMLSelect
              fill
              value={form.campaign_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, campaign_id: e.target.value }))
              }
              options={campaignOptions}
              disabled={submitting}
            />
          )}
        </FormGroup>
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={onClose} disabled={submitting} />
            <Button
              intent={Intent.PRIMARY}
              icon="add"
              text="Create Team"
              loading={submitting}
              onClick={() => void handleSubmit()}
            />
          </>
        }
      />
    </Dialog>
  );
}
