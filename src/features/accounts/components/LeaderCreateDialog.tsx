/* eslint-disable react-hooks/set-state-in-effect */
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
  HTMLSelect,
  Callout,
  Tag,
} from "@blueprintjs/core";
import type {
  CommunityLeader,
  InfluenceLevel,
  SupportStatus,
  LeaderCreatePayload,
  LeaderUpdatePayload,
} from "../types";
import { useLeaderMutations } from "../hooks/useLeaderMutations";

const INFLUENCE_OPTIONS: { value: InfluenceLevel; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "KEY_INFLUENCER", label: "Key Influencer" },
];

const SUPPORT_OPTIONS: { value: SupportStatus; label: string }[] = [
  { value: "UNKNOWN", label: "Unknown" },
  { value: "SUPPORTER", label: "Supporter" },
  { value: "NEUTRAL", label: "Neutral" },
  { value: "OPPONENT", label: "Opponent" },
  { value: "UNDECIDED", label: "Undecided" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  /** Provide to switch to edit mode */
  existing?: CommunityLeader;
  onSuccess: (leader: CommunityLeader) => void;
}

export function LeaderCreateDialog({
  isOpen,
  onClose,
  campaignId,
  existing,
  onSuccess,
}: Props) {
  const isEdit = Boolean(existing);
  const { create, update, submitting, error, clearError } = useLeaderMutations();

  const [fullName, setFullName] = useState(existing?.full_name ?? "");
  const [organization, setOrganization] = useState(existing?.organization ?? "");
  const [affiliation, setAffiliation] = useState(existing?.affiliation ?? "");
  const [influenceLevel, setInfluenceLevel] = useState<InfluenceLevel>(
    existing?.influence_level ?? "LOW"
  );
  const [supportStatus, setSupportStatus] = useState<SupportStatus>(
    existing?.support_status ?? "UNKNOWN"
  );
  const [districtId, setDistrictId] = useState(existing?.district_id ?? "");
  const [relationshipOwnerId, setRelationshipOwnerId] = useState(existing?.relationship_owner_id ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");

  useEffect(() => {
    setFullName(existing?.full_name ?? "");
    setOrganization(existing?.organization ?? "");
    setAffiliation(existing?.affiliation ?? "");
    setInfluenceLevel(existing?.influence_level ?? "LOW");
    setSupportStatus(existing?.support_status ?? "UNKNOWN");
    setDistrictId(existing?.district_id ?? "");
    setRelationshipOwnerId(existing?.relationship_owner_id ?? "");
    setNotes(existing?.notes ?? "");
  }, [existing, isOpen]);

  const isValid = fullName.trim().length > 0;

  const handleClose = useCallback(() => {
    clearError();
    if (!existing) {
      setFullName("");
      setOrganization("");
      setAffiliation("");
      setInfluenceLevel("LOW");
      setSupportStatus("UNKNOWN");
      setDistrictId("");
      setRelationshipOwnerId("");
      setNotes("");
    }
    onClose();
  }, [existing, onClose, clearError]);

  const handleSubmit = async () => {
    if (!isValid) return;
    let leader: CommunityLeader | null = null;
    if (isEdit && existing) {
      const payload: LeaderUpdatePayload = {
        full_name: fullName.trim(),
        organization: organization.trim() || undefined,
        affiliation: affiliation.trim() || undefined,
        influence_level: influenceLevel,
        support_status: supportStatus,
        district_id: districtId.trim() || undefined,
        relationship_owner_id: relationshipOwnerId.trim() || undefined,
        notes: notes.trim() || undefined,
      };
      leader = await update(existing.id, payload);
    } else {
      const payload: LeaderCreatePayload = {
        full_name: fullName.trim(),
        organization: organization.trim() || undefined,
        affiliation: affiliation.trim() || undefined,
        influence_level: influenceLevel,
        support_status: supportStatus,
        campaign_id: campaignId,
        district_id: districtId.trim() || undefined,
        relationship_owner_id: relationshipOwnerId.trim() || undefined,
        notes: notes.trim() || undefined,
      };
      leader = await create(payload);
    }
    if (leader) {
      onSuccess(leader);
      handleClose();
    }
  };

  return (
    <Dialog
      title={isEdit ? "Edit Community Leader" : "Add Community Leader"}
      isOpen={isOpen}
      onClose={handleClose}
      icon="person"
      style={{ width: 520 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 12, borderRadius: 0 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="Full Name" labelInfo="(required)" labelFor="ldr-name">
          <InputGroup
            id="ldr-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Campaign" labelFor="ldr-campaign">
          <Tag minimal style={{ borderRadius: 0, fontSize: 13 }}>
            Campaign #{campaignId}
          </Tag>
        </FormGroup>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormGroup label="Organization" labelFor="ldr-org">
            <InputGroup
              id="ldr-org"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Organization (optional)"
            />
          </FormGroup>
          <FormGroup label="Affiliation" labelFor="ldr-aff">
            <InputGroup
              id="ldr-aff"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="Party / group (optional)"
            />
          </FormGroup>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormGroup label="Influence Level" labelInfo="(required)" labelFor="ldr-influence">
            <HTMLSelect
              id="ldr-influence"
              value={influenceLevel}
              onChange={(e) => setInfluenceLevel(e.target.value as InfluenceLevel)}
              options={INFLUENCE_OPTIONS}
              fill
            />
          </FormGroup>
          <FormGroup label="Support Status" labelFor="ldr-support">
            <HTMLSelect
              id="ldr-support"
              value={supportStatus}
              onChange={(e) => setSupportStatus(e.target.value as SupportStatus)}
              options={SUPPORT_OPTIONS}
              fill
            />
          </FormGroup>
        </div>

        <FormGroup label="District ID" labelFor="ldr-district" helperText="Epic 10 district select coming soon — enter ID directly">
          <InputGroup
            id="ldr-district"
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            placeholder="District ID (optional)"
          />
        </FormGroup>

        <FormGroup label="Relationship Owner ID" labelFor="ldr-owner" helperText="User selector can be wired once user lookup endpoint is available">
          <InputGroup
            id="ldr-owner"
            value={relationshipOwnerId}
            onChange={(e) => setRelationshipOwnerId(e.target.value)}
            placeholder="User ID (optional)"
          />
        </FormGroup>

        <FormGroup label="Notes" labelFor="ldr-notes">
          <TextArea
            id="ldr-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fill
            rows={3}
            placeholder="Internal notes (optional)"
          />
          <Callout intent={Intent.WARNING} minimal style={{ marginTop: 6, borderRadius: 0, fontSize: 12 }}>
            Sensitive — visible to managers only
          </Callout>
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
              {isEdit ? "Save Changes" : "Add Leader"}
            </Button>
          </>
        }
      />
    </Dialog>
  );
}
