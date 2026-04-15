import { useState } from "react";
import {
  HTMLTable,
  Tag,
  Intent,
  Button,
  Spinner,
  NonIdealState,
  Callout,
  Switch,
  Classes,
} from "@blueprintjs/core";
import { useNavigate, useSearchParams } from "react-router";
import type { CampaignStatus } from "../types";
import {
  CAMPAIGN_STATUS_INTENT,
  CAMPAIGN_STATUS_LABEL,
  CAMPAIGN_TYPE_LABEL,
} from "../types";
import { useCampaignList } from "../hooks/useCampaignList";
import CampaignCreateDialog from "./CampaignCreateDialog";

// BR-036: Default view shows only operational (non-terminal) campaigns
const ACTIVE_STATUSES: CampaignStatus[] = ["PLANNED", "ACTIVE", "ON_HOLD"];

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

export default function CampaignsPage() {
  const navigate = useNavigate();
  // BR-036: Persist filter in URL so bookmarks and shares retain state
  const [searchParams, setSearchParams] = useSearchParams();
  const showAll = searchParams.get("show_all") === "true";

  const { campaigns, loading, error, refetch } = useCampaignList();
  const [createOpen, setCreateOpen] = useState(false);

  // Client-side filter: apply default status filter unless "show all" is toggled
  const displayed = showAll
    ? campaigns
    : campaigns.filter((c) => ACTIVE_STATUSES.includes(c.campaign_status));

  const toggleShowAll = (checked: boolean) => {
    setSearchParams(checked ? { show_all: "true" } : {});
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <Callout
        intent={Intent.DANGER}
        icon="error"
        title="Failed to load campaigns"
        style={{ margin: 24 }}
      >
        {error}
        <br />
        <Button
          minimal
          intent={Intent.DANGER}
          text="Retry"
          onClick={refetch}
          style={{ marginTop: 8 }}
        />
      </Callout>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Campaigns</h2>
        <Tag minimal intent={Intent.NONE} style={{ fontSize: 12 }}>
          {displayed.length}
        </Tag>
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}
        >
          {/* BR-036: Toggle to include terminal statuses */}
          <Switch
            label="Show completed & cancelled"
            checked={showAll}
            onChange={(e) => toggleShowAll(e.target.checked)}
            inline
            style={{ marginBottom: 0 }}
          />
          <Button
            icon="plus"
            intent={Intent.PRIMARY}
            text="New Campaign"
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Empty state */}
      {displayed.length === 0 ? (
        <NonIdealState
          icon="flag"
          title={showAll ? "No campaigns found" : "No active campaigns"}
          description={
            showAll
              ? "Create your first campaign to get started."
              : "All campaigns are completed or cancelled. Toggle the switch above to view them."
          }
          action={
            <Button
              icon="plus"
              intent={Intent.PRIMARY}
              text="New Campaign"
              onClick={() => setCreateOpen(true)}
            />
          }
        />
      ) : (
        <HTMLTable
          striped
          interactive
          bordered
          style={{ width: "100%", fontSize: 12 }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Project Code</th>
              <th>Type</th>
              <th>Status</th>
              <th>Target Start</th>
              <th>Target Completion</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigate(`/campaigns/${c.id}`)}
                style={{
                  cursor: "pointer",
                  // BR-042: Visual treatment for cancelled campaigns
                  opacity: c.campaign_status === "CANCELLED" ? 0.6 : 1,
                }}
              >
                <td>
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                </td>
                <td>
                  <code className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                    {c.project_code}
                  </code>
                </td>
                <td>
                  {CAMPAIGN_TYPE_LABEL[c.campaign_type] ?? c.campaign_type}
                </td>
                <td>
                  <Tag minimal intent={CAMPAIGN_STATUS_INTENT[c.campaign_status]}>
                    {CAMPAIGN_STATUS_LABEL[c.campaign_status] ?? c.campaign_status}
                  </Tag>
                </td>
                <td>{formatDate(c.target_start)}</td>
                <td>{formatDate(c.target_completion)}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}

      <CampaignCreateDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
