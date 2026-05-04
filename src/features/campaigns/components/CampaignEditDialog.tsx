import { useState, useCallback, useEffect } from "react";
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
  Classes,
} from "@blueprintjs/core";
import type { Campaign } from "../types";
import { updateCampaign } from "../api/campaignApi";
import { appToaster } from "../../../toaster";

interface Props {
  isOpen: boolean;
  campaign: Campaign;
  onClose: () => void;
  onUpdated: () => void;
}

export default function CampaignEditDialog({ isOpen, campaign, onClose, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetStart, setTargetStart] = useState("");
  const [targetCompletion, setTargetCompletion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setName(campaign.name);
      setDescription(campaign.description ?? "");
      setTargetStart(campaign.target_start ?? "");
      setTargetCompletion(campaign.target_completion ?? "");
      setError(null);
    }
  }, [isOpen, campaign]);

  // BR-037: Validate target_start < target_completion
  const dateError =
    targetStart && targetCompletion && targetStart >= targetCompletion
      ? "Target completion must be after the start date."
      : null;

  const isPlanned = campaign.campaign_status === "PLANNED";
  const datesReadOnly = !isPlanned;

  const isValid =
    name.trim().length > 0 &&
    targetStart.length > 0 &&
    targetCompletion.length > 0 &&
    !dateError;

  const handleClose = useCallback(() => {
    setError(null);
    onClose();
  }, [onClose]);

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      await updateCampaign(campaign.id, {
        name: name.trim(),
        description: description.trim() || null,
        target_start: targetStart,
        target_completion: targetCompletion,
      });
      const toaster = await appToaster;
      toaster.show({
        message: "Campaign updated successfully.",
        intent: Intent.SUCCESS,
        icon: "tick",
        timeout: 4000,
      });
      handleClose();
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Campaign"
      icon="edit"
      style={{ width: 560, borderRadius: 0 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="Campaign Name" labelInfo="(required)">
          <InputGroup
            placeholder="e.g. Luzon Expansion 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            style={{ borderRadius: 0 }}
          />
        </FormGroup>

        <FormGroup label="Description" labelInfo="(optional)">
          <TextArea
            fill
            rows={3}
            placeholder="Describe the campaign's purpose and scope..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ borderRadius: 0 }}
          />
        </FormGroup>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormGroup
            label="Project Code"
            helperText="Auto-generated and cannot be changed."
          >
            <InputGroup
              value={campaign.project_code}
              readOnly
              disabled
              style={{ background: "var(--cds-layer-02)", borderRadius: 0 }}
            />
          </FormGroup>

          <FormGroup
            label="Campaign Type"
            helperText="Immutable after creation."
          >
            <InputGroup
              value={campaign.campaign_type}
              readOnly
              disabled
              style={{ background: "var(--cds-layer-02)", borderRadius: 0 }}
            />
          </FormGroup>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormGroup label="Target Start" labelInfo="(required)">
            <InputGroup
              type="date"
              value={targetStart}
              onChange={(e) => setTargetStart(e.target.value)}
              leftIcon="calendar"
              readOnly={datesReadOnly}
              disabled={datesReadOnly}
              style={datesReadOnly ? { background: "var(--cds-layer-02)", borderRadius: 0 } : { borderRadius: 0 }}
            />
          </FormGroup>

          <FormGroup
            label="Target Completion"
            labelInfo="(required)"
            helperText={dateError ?? undefined}
            intent={dateError ? Intent.DANGER : Intent.NONE}
          >
            <InputGroup
              type="date"
              value={targetCompletion}
              onChange={(e) => setTargetCompletion(e.target.value)}
              leftIcon="calendar"
              readOnly={datesReadOnly}
              disabled={datesReadOnly}
              intent={dateError ? Intent.DANGER : Intent.NONE}
              style={datesReadOnly ? { background: "var(--cds-layer-02)", borderRadius: 0 } : { borderRadius: 0 }}
            />
          </FormGroup>
        </div>

        {!isPlanned && (
          <p className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }}>
            Dates are locked while the campaign is {campaign.campaign_status.toLowerCase().replace("_", " ")}.
          </p>
        )}
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button
              text="Cancel"
              onClick={handleClose}
              disabled={submitting}
              style={{ borderRadius: 0, minHeight: 48 }}
            />
            <Button
              text="Save Changes"
              intent={Intent.PRIMARY}
              onClick={handleSubmit}
              loading={submitting}
              disabled={!isValid}
              style={{ borderRadius: 0, minHeight: 48 }}
            />
          </>
        }
      />
    </Dialog>
  );
}
