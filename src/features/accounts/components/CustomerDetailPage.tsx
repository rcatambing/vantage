import { useState } from "react";
import {
  Button,
  Intent,
  Spinner,
  NonIdealState,
  Callout,
  HTMLSelect,
  Tab,
  Tabs,
  Tag,
  Icon,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import { useAccount } from "../hooks/useAccount";
import { useAccountMutations } from "../hooks/useAccountMutations";
import { AccountStatusTag } from "./AccountStatusTag";
import { AccountCreateDialog } from "./AccountCreateDialog";
import { AccountGate } from "./AccountGate";
import { AccountAffiliationsPanel } from "./AccountAffiliationsPanel";
import { AccountSignalsPanel } from "./AccountSignalsPanel";
import type { AccountStatus } from "../types";
import { appToaster } from "../../../toaster";

const ACCOUNT_STATUS_OPTIONS: { value: AccountStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PROSPECT", label: "Prospect" },
  { value: "CHURNED", label: "Churned" },
];

const SEGMENT_LABEL: Record<string, string> = {
  ENTERPRISE: "Enterprise",
  MID_MARKET: "Mid-Market",
  SMB: "SMB",
  GOVERNMENT: "Government",
  NGO: "NGO",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso ?? "—";
  }
}

export default function CustomerDetailPage() {
  return (
    <AccountGate
      allowedTypes={["OPERATIONS", "SPECIAL_PROJECT"]}
      deniedMessage="Customer accounts are not available for Election campaigns."
    >
      <CustomerDetailContent />
    </AccountGate>
  );
}

function CustomerDetailContent() {
  const { id, campaignId } = useParams<{ id: string; campaignId: string }>();
  const navigate = useNavigate();
  const { account, loading, error, reload } = useAccount(id);
  const { update } = useAccountMutations();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);
  const [signalsReloadToken, setSignalsReloadToken] = useState(0);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <Callout
        intent={Intent.DANGER}
        icon="error"
        title="Failed to load account"
        style={{ margin: 24, borderRadius: 0 }}
      >
        {error}
      </Callout>
    );
  }

  if (!account) {
    return (
      <NonIdealState
        icon="office"
        title="Account not found"
        action={
          <Button onClick={() => navigate(`/campaigns/${campaignId}/accounts`)} style={{ borderRadius: 0 }}>
            Back to Accounts
          </Button>
        }
      />
    );
  }

  if (campaignId && String(account.campaign_id) !== campaignId) {
    return (
      <NonIdealState
        icon="lock"
        title="Account not available in this campaign"
        description="The requested account does not belong to the current campaign."
        action={
          <Button onClick={() => navigate(`/campaigns/${campaignId}/accounts`)} style={{ borderRadius: 0 }}>
            Back to Accounts
          </Button>
        }
      />
    );
  }

  async function handleStatusChange(newStatus: AccountStatus) {
    if (!account || statusChanging) return;
    setStatusChanging(true);
    const updated = await update(account.id, { status: newStatus });
    const toaster = await appToaster;
    if (updated) {
      toaster.show({ message: `Status updated to ${newStatus}`, intent: Intent.SUCCESS });
      reload();
    } else {
      toaster.show({ message: "Unable to update account status", intent: Intent.DANGER });
    }
    setStatusChanging(false);
  }

  return (
    <div style={{ padding: 16 }}>
      {/* ── Back nav ── */}
      <Button
        minimal
        icon="arrow-left"
        small
        onClick={() => navigate(`/campaigns/${campaignId}/accounts`)}
        style={{ marginBottom: 12, borderRadius: 0 }}
      >
        Customer Accounts
      </Button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
        {/* ── Left: Main content ── */}
        <div>
          {/* Profile card */}
          <div
            style={{
              background: "var(--cds-layer-01, #f4f4f4)",
              padding: 20,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 300, letterSpacing: 0 }}>
                {account.account_name}
              </h1>
              <Button
                icon="edit"
                small
                minimal
                onClick={() => setEditDialogOpen(true)}
                style={{ borderRadius: 0 }}
              >
                Edit
              </Button>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {account.segment && (
                <Tag minimal style={{ borderRadius: 0 }}>
                  {SEGMENT_LABEL[account.segment] ?? account.segment}
                </Tag>
              )}
              <AccountStatusTag status={account.status} />
            </div>

            {account.district_name && (
              <p style={{ marginTop: 4, fontSize: 13, color: "var(--cds-text-secondary, #525252)" }}>
                <Icon icon="map-marker" size={12} style={{ marginRight: 4 }} />
                {account.district_name}
              </p>
            )}
          </div>

          {/* Notes */}
          {account.notes && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cds-text-secondary, #525252)", marginBottom: 6 }}>
                Notes
              </div>
              <div
                style={{
                  background: "var(--cds-layer-01, #f4f4f4)",
                  padding: 12,
                  fontSize: 14,
                  whiteSpace: "pre-wrap",
                }}
              >
                {account.notes}
              </div>
            </div>
          )}

          {/* Related activities + intelligence tabs */}
          <div>
            <Tabs
              id="account-detail-tabs"
              renderActiveTabPanelOnly
              defaultSelectedTabId="affiliations"
            >
              <Tab
                id="affiliations"
                title="Affiliations"
                panel={
                  <AccountAffiliationsPanel
                    accountId={account.id}
                    onChanged={() => setSignalsReloadToken((v) => v + 1)}
                  />
                }
              />
              <Tab
                id="signals"
                title="Signals"
                panel={<AccountSignalsPanel accountId={account.id} reloadToken={signalsReloadToken} />}
              />
              <Tab
                id="activities"
                title="Activities"
                panel={
                  <p style={{ fontSize: 13, color: "var(--cds-text-secondary, #525252)", paddingTop: 8 }}>
                    Calendar activities will appear here after Epic 12 is live.
                  </p>
                }
              />
            </Tabs>
          </div>
        </div>

        {/* ── Right rail ── */}
        <div
          style={{
            background: "var(--cds-layer-01, #f4f4f4)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Status */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cds-text-secondary, #525252)", marginBottom: 6 }}>
              Status
            </div>
            <HTMLSelect
              value={account.status}
              onChange={(e) => handleStatusChange(e.target.value as AccountStatus)}
              disabled={statusChanging}
              options={ACCOUNT_STATUS_OPTIONS}
              fill
            />
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cds-text-secondary, #525252)", marginBottom: 6 }}>
              Primary Contact
            </div>
            {account.has_contact ? (
              <Tag icon="lock" minimal style={{ borderRadius: 0 }}>
                {account.primary_contact_name ?? "Contact on file"}
              </Tag>
            ) : (
              <span style={{ fontSize: 13, color: "var(--cds-text-secondary, #525252)" }}>
                {account.primary_contact_name ?? "—"}
              </span>
            )}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cds-text-secondary, #525252)", marginBottom: 6 }}>
              Owner
            </div>
            <span style={{ fontSize: 13, color: "var(--cds-text-secondary, #525252)" }}>
              {account.owner_id ? `User #${account.owner_id}` : "Unassigned"}
            </span>
          </div>

          {/* Timestamps */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cds-text-secondary, #525252)", marginBottom: 6 }}>
              Timeline
            </div>
            <div style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-secondary, #525252)", display: "flex", flexDirection: "column", gap: 4 }}>
              <div>Created: {formatDate(account.created_at)}</div>
              {account.updated_at && <div>Updated: {formatDate(account.updated_at)}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit dialog ── */}
      {campaignId && (
        <AccountCreateDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          campaignId={campaignId}
          existing={account}
          onSuccess={() => {
            reload();
            setEditDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
