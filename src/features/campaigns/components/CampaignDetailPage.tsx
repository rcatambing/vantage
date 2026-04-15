import { useState, useCallback } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Callout,
  Card,
  Classes,
  Elevation,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  NonIdealState,
  Popover,
  Spinner,
  Tag,
  Tooltip,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import { useCampaign } from "../hooks/useCampaign";
import { useObjectives } from "../hooks/useObjectives";
import {
  activateCampaign,
  holdCampaign,
  cancelCampaign,
  completeCampaign,
  deleteCampaign,
} from "../api/campaignApi";
import {
  CAMPAIGN_STATUS_INTENT,
  CAMPAIGN_STATUS_LABEL,
  CAMPAIGN_TYPE_LABEL,
} from "../types";
import ObjectivesPanel from "./ObjectivesPanel";
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

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const campaignId = parseInt(id ?? "", 10);

  const {
    campaign,
    loading: campaignLoading,
    error: campaignError,
    refetch: refetchCampaign,
  } = useCampaign(isNaN(campaignId) ? -1 : campaignId);

  const {
    objectives,
    diagnostics,
    loading: objLoading,
    error: objError,
    refetch: refetchObjectives,
  } = useObjectives(isNaN(campaignId) ? null : campaignId);

  const [actionLoading, setActionLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Wrap all status-changing API calls with loading + error toast
  // Must be declared before early returns to satisfy Rules of Hooks.
  const doAction = useCallback(
    async (action: () => Promise<unknown>) => {
      setActionLoading(true);
      try {
        await action();
        await refetchCampaign();
        await refetchObjectives();
      } catch (err) {
        const toaster = await appToaster;
        toaster.show({
          message: err instanceof Error ? err.message : "Action failed",
          intent: Intent.DANGER,
          icon: "error",
        });
      } finally {
        setActionLoading(false);
      }
    },
    [refetchCampaign, refetchObjectives]
  );

  // Guard invalid ID
  if (isNaN(campaignId)) {
    return (
      <NonIdealState
        icon="error"
        title="Invalid campaign ID"
        action={
          <Button text="Back to Campaigns" onClick={() => navigate("/campaigns")} />
        }
      />
    );
  }

  if (campaignLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (campaignError || !campaign) {
    return (
      <NonIdealState
        icon="search"
        title="Campaign not found"
        description={campaignError ?? "This campaign does not exist or was deleted."}
        action={
          <Button text="Back to Campaigns" onClick={() => navigate("/campaigns")} />
        }
      />
    );
  }

  const isCancelled = campaign.campaign_status === "CANCELLED";
  const isCompleted = campaign.campaign_status === "COMPLETED";
  const isTerminal = isCancelled || isCompleted;

  const handleActivate = () =>
    doAction(async () => {
      await activateCampaign(campaignId);
      const toaster = await appToaster;
      toaster.show({
        message: "Campaign activated successfully.",
        intent: Intent.SUCCESS,
        icon: "play",
      });
    });

  const handleStatusChange = (status: "ON_HOLD" | "CANCELLED" | "COMPLETED") =>
    doAction(() => {
      if (status === "ON_HOLD") return holdCampaign(campaignId);
      if (status === "CANCELLED") return cancelCampaign(campaignId);
      return completeCampaign(campaignId);
    });

  const handleDelete = async () => {
    setDeleteError(null);
    try {
      await deleteCampaign(campaignId);
      const toaster = await appToaster;
      toaster.show({ message: "Campaign deleted.", intent: Intent.NONE, icon: "trash" });
      navigate("/campaigns");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete campaign");
    }
  };

  // BR-028: Delete is blocked for ACTIVE and ON_HOLD campaigns
  const canDelete = !["ACTIVE", "ON_HOLD"].includes(campaign.campaign_status);

  // BR-022: Evaluate activation preconditions
  const objectiveCount = diagnostics?.objective_count ?? 0;
  const activationBlockers: string[] = [];
  if (objectiveCount === 0) activationBlockers.push("At least one objective must be added first.");
  if (!campaign.target_start) activationBlockers.push("Target start date must be set.");
  if (!campaign.target_completion) activationBlockers.push("Target completion date must be set.");
  if (
    campaign.target_start &&
    campaign.target_completion &&
    campaign.target_start >= campaign.target_completion
  ) {
    activationBlockers.push("Target start must be before target completion.");
  }
  const canActivate = activationBlockers.length === 0;

  // Overflow menu content per status (handles Cancel + Delete)
  const overflowMenu = (
    <Menu>
      <MenuItem
        icon="cross"
        text="Cancel Campaign"
        intent={Intent.DANGER}
        onClick={() => handleStatusChange("CANCELLED")}
      />
      <MenuDivider />
      <Tooltip
        content="Campaign must be Cancelled or Completed before it can be deleted."
        disabled={canDelete}
      >
        <MenuItem
          icon="trash"
          text="Delete Campaign"
          intent={canDelete ? Intent.DANGER : Intent.NONE}
          disabled={!canDelete}
          onClick={canDelete ? () => setDeleteOpen(true) : undefined}
        />
      </Tooltip>
    </Menu>
  );

  return (
    <div style={{ padding: 24 }}>
      {/* Back navigation */}
      <div style={{ marginBottom: 12 }}>
        <Button
          minimal
          small
          icon="arrow-left"
          text="All Campaigns"
          onClick={() => navigate("/campaigns")}
        />
      </div>

      {/* Campaign header card (BR-042: 60% opacity for cancelled) */}
      <Card
        elevation={Elevation.TWO}
        style={{ marginBottom: 20, opacity: isCancelled ? 0.6 : 1 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* Title, status badge, and metadata */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20 }}>{campaign.name}</h2>
              <Tag minimal intent={CAMPAIGN_STATUS_INTENT[campaign.campaign_status]}>
                {CAMPAIGN_STATUS_LABEL[campaign.campaign_status]}
              </Tag>
              <code
                className={Classes.TEXT_MUTED}
                style={{
                  fontSize: 12,
                  background: "var(--cds-layer-02)",
                  padding: "2px 8px",
                  borderRadius: 0,
                }}
              >
                {campaign.project_code}
              </code>
            </div>

            <div className={Classes.TEXT_MUTED} style={{ fontSize: 13, marginBottom: 8 }}>
              {CAMPAIGN_TYPE_LABEL[campaign.campaign_type] ?? campaign.campaign_type}
              &nbsp;·&nbsp; Target:{" "}
              {formatDate(campaign.target_start)} – {formatDate(campaign.target_completion)}
              {campaign.actual_start && (
                <> &nbsp;·&nbsp; Started: {formatDate(campaign.actual_start)}</>
              )}
              {campaign.actual_completion && (
                <> &nbsp;·&nbsp; Completed: {formatDate(campaign.actual_completion)}</>
              )}
            </div>

            {campaign.description && (
              <p style={{ margin: 0, fontSize: 13 }}>{campaign.description}</p>
            )}
          </div>

          {/* BR-035: Context-sensitive status action buttons */}
          {!isTerminal && (
            <div
              style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
            >
              {/* PLANNED: Activate + overflow */}
              {campaign.campaign_status === "PLANNED" && (
                <>
                  <Button
                    intent={Intent.SUCCESS}
                    icon="play"
                    text="Activate"
                    onClick={handleActivate}
                    loading={actionLoading}
                    disabled={!canActivate}
                  />
                  <Popover content={overflowMenu} placement="bottom-end">
                    <Button icon="more" minimal disabled={actionLoading} />
                  </Popover>
                </>
              )}

              {/* ACTIVE: Put On Hold + Mark Complete + overflow */}
              {campaign.campaign_status === "ACTIVE" && (
                <>
                  <ButtonGroup>
                    <Button
                      icon="pause"
                      text="Put On Hold"
                      onClick={() => handleStatusChange("ON_HOLD")}
                      loading={actionLoading}
                    />
                    <Button
                      intent={Intent.PRIMARY}
                      icon="tick-circle"
                      text="Mark Complete"
                      onClick={() => handleStatusChange("COMPLETED")}
                      loading={actionLoading}
                    />
                  </ButtonGroup>
                  <Popover content={overflowMenu} placement="bottom-end">
                    <Button icon="more" minimal disabled={actionLoading} />
                  </Popover>
                </>
              )}

              {/* ON_HOLD: Resume + overflow */}
              {campaign.campaign_status === "ON_HOLD" && (
                <>
                  <Button
                    intent={Intent.SUCCESS}
                    icon="play"
                    text="Resume"
                    onClick={handleActivate}
                    loading={actionLoading}
                  />
                  <Popover content={overflowMenu} placement="bottom-end">
                    <Button icon="more" minimal disabled={actionLoading} />
                  </Popover>
                </>
              )}
            </div>
          )}
        </div>

        {/* BR-035: Activation precondition callout (shown when PLANNED but can't activate yet) */}
        {campaign.campaign_status === "PLANNED" && !canActivate && (
          <Callout intent={Intent.NONE} icon="info-sign" title="Cannot activate yet" style={{ marginTop: 16 }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {activationBlockers.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </Callout>
        )}

        {/* Terminal state banners */}
        {isCompleted && (
          <Callout intent={Intent.SUCCESS} icon="tick-circle" style={{ marginTop: 16 }}>
            Campaign completed on {formatDate(campaign.actual_completion)}.
          </Callout>
        )}
        {isCancelled && (
          <Callout intent={Intent.DANGER} icon="cross-circle" style={{ marginTop: 16 }}>
            This campaign has been cancelled. It is preserved for audit and reporting purposes.
          </Callout>
        )}
      </Card>

      {/* Objectives section (BR-042: 50% opacity for cancelled) */}
      <div style={{ opacity: isCancelled ? 0.5 : 1 }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}
        >
          <h3 style={{ margin: 0, fontSize: 15 }}>Objectives</h3>
          {diagnostics != null && (
            <Tag minimal style={{ fontSize: 11 }}>
              {diagnostics.objective_count}
            </Tag>
          )}
        </div>

        <ObjectivesPanel
          objectives={objectives}
          diagnostics={diagnostics}
          loading={objLoading}
          error={objError}
          campaignStatus={campaign.campaign_status}
          campaignId={campaignId}
          onRefresh={refetchObjectives}
        />
      </div>

      {/* BR-041: Delete confirmation */}
      <Alert
        isOpen={deleteOpen}
        intent={Intent.DANGER}
        icon="trash"
        confirmButtonText="Delete Campaign"
        cancelButtonText="Keep"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteError(null);
        }}
      >
        <p>
          Delete campaign <strong>{campaign.name}</strong>?
        </p>
        <p className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
          This will permanently remove the campaign and all its objectives and tasks.
          This action cannot be undone.
        </p>
        {deleteError && (
          <Callout intent={Intent.DANGER} style={{ marginTop: 8 }}>
            {deleteError}
          </Callout>
        )}
      </Alert>
    </div>
  );
}
