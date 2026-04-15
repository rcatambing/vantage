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
  CustomerAccount,
  AccountSegment,
  AccountCreatePayload,
  AccountUpdatePayload,
} from "../types";
import { useAccountMutations } from "../hooks/useAccountMutations";

const SEGMENT_OPTIONS = [
  { value: "", label: "— None —" },
  { value: "ENTERPRISE", label: "Enterprise" },
  { value: "MID_MARKET", label: "Mid-Market" },
  { value: "SMB", label: "SMB" },
  { value: "GOVERNMENT", label: "Government" },
  { value: "NGO", label: "NGO" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  existing?: CustomerAccount;
  onSuccess: (account: CustomerAccount) => void;
}

export function AccountCreateDialog({
  isOpen,
  onClose,
  campaignId,
  existing,
  onSuccess,
}: Props) {
  const isEdit = Boolean(existing);
  const { create, update, submitting, error, clearError } = useAccountMutations();

  const [accountName, setAccountName] = useState(existing?.account_name ?? "");
  const [segment, setSegment] = useState<AccountSegment | "">(
    existing?.segment ?? ""
  );
  const [districtId, setDistrictId] = useState(existing?.district_id ?? "");
  const [primaryContactName, setPrimaryContactName] = useState(
    existing?.primary_contact_name ?? ""
  );
  const [ownerId, setOwnerId] = useState(existing?.owner_id ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");

  useEffect(() => {
    setAccountName(existing?.account_name ?? "");
    setSegment(existing?.segment ?? "");
    setDistrictId(existing?.district_id ?? "");
    setPrimaryContactName(existing?.primary_contact_name ?? "");
    setOwnerId(existing?.owner_id ?? "");
    setNotes(existing?.notes ?? "");
  }, [existing, isOpen]);

  const isValid = accountName.trim().length > 0;

  const handleClose = useCallback(() => {
    clearError();
    if (!existing) {
      setAccountName("");
      setSegment("");
      setDistrictId("");
      setPrimaryContactName("");
      setOwnerId("");
      setNotes("");
    }
    onClose();
  }, [existing, onClose, clearError]);

  const handleSubmit = async () => {
    if (!isValid) return;
    let account: CustomerAccount | null = null;
    if (isEdit && existing) {
      const payload: AccountUpdatePayload = {
        account_name: accountName.trim(),
        segment: (segment as AccountSegment) || undefined,
        district_id: districtId.trim() || undefined,
        primary_contact_name: primaryContactName.trim() || undefined,
        owner_id: ownerId.trim() || undefined,
        notes: notes.trim() || undefined,
      };
      account = await update(existing.id, payload);
    } else {
      const payload: AccountCreatePayload = {
        account_name: accountName.trim(),
        campaign_id: campaignId,
        segment: (segment as AccountSegment) || undefined,
        district_id: districtId.trim() || undefined,
        primary_contact_name: primaryContactName.trim() || undefined,
        owner_id: ownerId.trim() || undefined,
        notes: notes.trim() || undefined,
      };
      account = await create(payload);
    }
    if (account) {
      onSuccess(account);
      handleClose();
    }
  };

  return (
    <Dialog
      title={isEdit ? "Edit Account" : "Add Customer Account"}
      isOpen={isOpen}
      onClose={handleClose}
      icon="office"
      style={{ width: 500 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 12, borderRadius: 0 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="Account Name" labelInfo="(required)" labelFor="acct-name">
          <InputGroup
            id="acct-name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Account name"
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Campaign" labelFor="acct-campaign">
          <Tag minimal style={{ borderRadius: 0, fontSize: 13 }}>
            Campaign #{campaignId}
          </Tag>
        </FormGroup>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormGroup label="Segment" labelFor="acct-segment">
            <HTMLSelect
              id="acct-segment"
              value={segment}
              onChange={(e) => setSegment(e.target.value as AccountSegment | "")}
              options={SEGMENT_OPTIONS}
              fill
            />
          </FormGroup>
          <FormGroup label="District ID" labelFor="acct-district" helperText="Epic 10 select coming soon">
            <InputGroup
              id="acct-district"
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              placeholder="District ID (optional)"
            />
          </FormGroup>
        </div>

        <FormGroup label="Primary Contact Name" labelFor="acct-contact">
          <InputGroup
            id="acct-contact"
            value={primaryContactName}
            onChange={(e) => setPrimaryContactName(e.target.value)}
            placeholder="Contact name (optional)"
          />
        </FormGroup>

        <FormGroup label="Owner ID" labelFor="acct-owner" helperText="User selector can be wired once user lookup endpoint is available">
          <InputGroup
            id="acct-owner"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            placeholder="User ID (optional)"
          />
        </FormGroup>

        <FormGroup label="Notes" labelFor="acct-notes">
          <TextArea
            id="acct-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fill
            rows={3}
            placeholder="Internal notes (optional)"
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
              {isEdit ? "Save Changes" : "Add Account"}
            </Button>
          </>
        }
      />
    </Dialog>
  );
}
