import { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Button,
  Callout,
  Classes,
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  InputGroup,
  Intent,
  NonIdealState,
  Spinner,
  Switch,
  Tag,
} from "@blueprintjs/core";
import { useNavigate } from "react-router";
import { listOfficeCampaigns, linkOfficeToCampaign, unlinkOfficeFromCampaign } from "../api/officeApi";
import type { CampaignOfficeLink } from "../types";
import { appToaster } from "../../../toaster";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

interface Props {
  officeId: string;
}

export function CampaignLinksPanel({ officeId }: Props) {
  const navigate = useNavigate();
  const [links, setLinks] = useState<CampaignOfficeLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [unlinkTarget, setUnlinkTarget] = useState<CampaignOfficeLink | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Link dialog state
  const [campaignId, setCampaignId] = useState("");
  const [isPrimaryHq, setIsPrimaryHq] = useState(false);
  const [linkNotes, setLinkNotes] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    listOfficeCampaigns(officeId)
      .then(setLinks)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load campaign links")
      )
      .finally(() => setLoading(false));
  }, [officeId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleLink = async () => {
    if (!campaignId.trim()) return;
    setSubmitting(true);
    setLinkError(null);
    try {
      await linkOfficeToCampaign(officeId, {
        campaign_id: campaignId.trim(),
        is_primary_hq: isPrimaryHq,
        notes: linkNotes.trim() || undefined,
      });
      const toaster = await appToaster;
      toaster.show({ message: "Campaign linked.", intent: Intent.SUCCESS, icon: "tick" });
      setCampaignId("");
      setIsPrimaryHq(false);
      setLinkNotes("");
      setLinkOpen(false);
      reload();
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : "Failed to link campaign");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlink = async () => {
    if (!unlinkTarget) return;
    setSubmitting(true);
    try {
      await unlinkOfficeFromCampaign(officeId, unlinkTarget.campaign_id);
      const toaster = await appToaster;
      toaster.show({ message: "Campaign unlinked.", intent: Intent.NONE, icon: "unlink" });
      setUnlinkTarget(null);
      reload();
    } catch (err) {
      const toaster = await appToaster;
      toaster.show({
        message: err instanceof Error ? err.message : "Failed to unlink",
        intent: Intent.DANGER,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
        <Spinner size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <Callout intent={Intent.DANGER} icon="error" title="Failed to load campaign links">
        {error}
      </Callout>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13 }}>Linked Campaigns</span>
        <Button small icon="link" text="Link Campaign" onClick={() => setLinkOpen(true)} />
      </div>

      {links.length === 0 ? (
        <NonIdealState icon="flag" title="No linked campaigns" description="Link this office to a campaign." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map((link) => (
            <div
              key={link.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                border: "1px solid var(--cds-border-subtle, #e0e0e0)",
              }}
            >
              <span
                style={{ flex: 1, fontSize: 13, fontWeight: 500, cursor: "pointer", color: "var(--cds-link-01, #0f62fe)" }}
                onClick={() => navigate(`/campaigns/${link.campaign_id}`)}
              >
                {link.campaign_name}
              </span>
              {link.is_primary_hq && (
                <Tag minimal intent={Intent.PRIMARY} style={{ fontSize: 10 }}>
                  HQ
                </Tag>
              )}
              <span style={{ fontSize: 11, color: "var(--cds-text-secondary, #525252)" }}>
                {formatDate(link.linked_at)}
              </span>
              <Button
                small
                minimal
                icon="unlink"
                intent={Intent.DANGER}
                onClick={() => setUnlinkTarget(link)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Link dialog */}
      <Dialog
        isOpen={linkOpen}
        onClose={() => { setLinkOpen(false); setCampaignId(""); setIsPrimaryHq(false); setLinkNotes(""); setLinkError(null); }}
        title="Link Campaign"
        icon="link"
        style={{ width: 440 }}
      >
        <DialogBody>
          {linkError && (
            <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
              {linkError}
            </Callout>
          )}
          <FormGroup label="Campaign ID" labelInfo="(required)">
            <InputGroup
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              placeholder="Campaign UUID"
              autoFocus
            />
          </FormGroup>
          <FormGroup label="Notes">
            <InputGroup
              value={linkNotes}
              onChange={(e) => setLinkNotes(e.target.value)}
              placeholder="Optional notes"
            />
          </FormGroup>
          <Switch
            label="This is the primary HQ for this campaign"
            checked={isPrimaryHq}
            onChange={(e) => setIsPrimaryHq((e.target as HTMLInputElement).checked)}
          />
        </DialogBody>
        <DialogFooter
          actions={
            <>
              <Button text="Cancel" onClick={() => setLinkOpen(false)} className={Classes.DIALOG_CLOSE_BUTTON} />
              <Button
                intent={Intent.PRIMARY}
                text="Link"
                onClick={handleLink}
                loading={submitting}
                disabled={!campaignId.trim() || submitting}
              />
            </>
          }
        />
      </Dialog>

      {/* Unlink confirmation */}
      <Alert
        isOpen={unlinkTarget != null}
        onClose={() => setUnlinkTarget(null)}
        onConfirm={handleUnlink}
        intent={Intent.DANGER}
        icon="unlink"
        confirmButtonText="Unlink"
        cancelButtonText="Cancel"
        loading={submitting}
      >
        <p>
          Unlink <strong>{unlinkTarget?.campaign_name}</strong> from this office?
        </p>
      </Alert>
    </div>
  );
}
