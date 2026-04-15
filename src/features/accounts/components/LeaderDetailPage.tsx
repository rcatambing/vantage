import { useState } from "react";
import {
  Button,
  Intent,
  Spinner,
  NonIdealState,
  Callout,
  Tag,
  HTMLSelect,
  Icon,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import { useLeader } from "../hooks/useLeader";
import { useLeaderMutations } from "../hooks/useLeaderMutations";
import { SupportStatusTag } from "./SupportStatusTag";
import { InfluenceTag } from "./InfluenceTag";
import { EngagementTimeline } from "./EngagementTimeline";
import { AddEngagementDialog } from "./AddEngagementDialog";
import { LeaderCreateDialog } from "./LeaderCreateDialog";
import { AccountGate } from "./AccountGate";
import type { LeaderStatus } from "../types";
import { appToaster } from "../../../toaster";

const LEADER_STATUS_OPTIONS: { value: LeaderStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "ARCHIVED", label: "Archived" },
];

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

export default function LeaderDetailPage() {
  return (
    <AccountGate
      allowedTypes={["ELECTION"]}
      deniedMessage="Community leader profiles are only available for Election campaigns."
    >
      <LeaderDetailContent />
    </AccountGate>
  );
}

function LeaderDetailContent() {
  const { id, campaignId } = useParams<{ id: string; campaignId: string }>();
  const navigate = useNavigate();
  const { leader, engagement, loading, error, reload } = useLeader(id);
  const { update } = useLeaderMutations();

  const [engDialogOpen, setEngDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);

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
        title="Failed to load leader"
        style={{ margin: 24, borderRadius: 0 }}
      >
        {error}
      </Callout>
    );
  }

  if (!leader) {
    return (
      <NonIdealState
        icon="person"
        title="Leader not found"
        action={
          <Button onClick={() => navigate(`/campaigns/${campaignId}/leaders`)} style={{ borderRadius: 0 }}>
            Back to Leaders
          </Button>
        }
      />
    );
  }

  if (campaignId && String(leader.campaign_id) !== campaignId) {
    return (
      <NonIdealState
        icon="lock"
        title="Leader not available in this campaign"
        description="The requested leader does not belong to the current campaign."
        action={
          <Button onClick={() => navigate(`/campaigns/${campaignId}/leaders`)} style={{ borderRadius: 0 }}>
            Back to Leaders
          </Button>
        }
      />
    );
  }

  const isOpponent = leader.support_status === "OPPONENT";

  async function handleStatusChange(newStatus: LeaderStatus) {
    if (!leader || statusChanging) return;
    setStatusChanging(true);
    const updated = await update(leader.id, { status: newStatus });
    const toaster = await appToaster;
    if (updated) {
      toaster.show({ message: `Status updated to ${newStatus}`, intent: Intent.SUCCESS });
      reload();
    } else {
      toaster.show({ message: "Unable to update leader status", intent: Intent.DANGER });
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
        onClick={() => navigate(`/campaigns/${campaignId}/leaders`)}
        style={{ marginBottom: 12, borderRadius: 0 }}
      >
        Community Leaders
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
              borderLeft: isOpponent ? "4px solid #da1e28" : "none",
              backgroundColor: isOpponent ? "rgba(218, 30, 40, 0.04)" : undefined,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 300, letterSpacing: 0 }}>
                {leader.full_name}
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

            {leader.organization && (
              <p style={{ margin: "0 0 2px", fontSize: 14, color: "var(--cds-text-secondary, #525252)" }}>
                {leader.organization}
              </p>
            )}
            {leader.affiliation && (
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--cds-text-secondary, #525252)" }}>
                {leader.affiliation}
              </p>
            )}

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <SupportStatusTag status={leader.support_status} />
              <InfluenceTag level={leader.influence_level} />
            </div>

            {leader.district_name && (
              <p style={{ marginTop: 8, fontSize: 13, color: "var(--cds-text-secondary, #525252)" }}>
                <Icon icon="map-marker" size={12} style={{ marginRight: 4 }} />
                {leader.district_name}
              </p>
            )}
          </div>

          {/* Notes */}
          {leader.notes && (
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
                {leader.notes}
              </div>
              <Callout intent={Intent.WARNING} minimal style={{ marginTop: 4, borderRadius: 0, fontSize: 12 }}>
                Sensitive — visible to managers only
              </Callout>
            </div>
          )}

          {/* Engagement timeline */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
                paddingBottom: 6,
                borderBottom: "1px solid var(--cds-border-subtle, #c6c6c6)",
              }}
            >
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                Engagement History
              </h3>
              <Button
                icon="add"
                small
                intent={Intent.PRIMARY}
                onClick={() => setEngDialogOpen(true)}
                style={{ borderRadius: 0 }}
              >
                Log Event
              </Button>
            </div>
            <EngagementTimeline events={engagement} />
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
              value={leader.status}
              onChange={(e) => handleStatusChange(e.target.value as LeaderStatus)}
              disabled={statusChanging}
              options={LEADER_STATUS_OPTIONS}
              fill
            />
          </div>

          {/* Relationship owner */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cds-text-secondary, #525252)", marginBottom: 6 }}>
              Relationship Owner
            </div>
            <span style={{ fontSize: 13, color: "var(--cds-text-secondary, #525252)" }}>
              {leader.relationship_owner_id ? `User #${leader.relationship_owner_id}` : "Unassigned"}
            </span>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cds-text-secondary, #525252)", marginBottom: 6 }}>
              Contact
            </div>
            {leader.has_contact ? (
              <Tag icon="lock" minimal style={{ borderRadius: 0 }}>
                Contact on file
              </Tag>
            ) : (
              <Tag minimal style={{ borderRadius: 0, color: "var(--cds-text-secondary, #525252)" }}>
                No contact on file
              </Tag>
            )}
          </div>

          {/* Timestamps */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cds-text-secondary, #525252)", marginBottom: 6 }}>
              Timeline
            </div>
            <div style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-secondary, #525252)", display: "flex", flexDirection: "column", gap: 4 }}>
              <div>Created: {formatDate(leader.created_at)}</div>
              {leader.updated_at && <div>Updated: {formatDate(leader.updated_at)}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Dialogs ── */}
      <AddEngagementDialog
        isOpen={engDialogOpen}
        onClose={() => setEngDialogOpen(false)}
        leaderId={leader.id}
        onSuccess={reload}
      />

      {campaignId && (
        <LeaderCreateDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          campaignId={campaignId}
          existing={leader}
          onSuccess={() => {
            reload();
            setEditDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
