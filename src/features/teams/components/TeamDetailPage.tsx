import { useState } from "react";
import {
  Button,
  Tag,
  Intent,
  Spinner,
  NonIdealState,
  Tabs,
  Tab,
  Card,
  Elevation,
  Classes,
  Callout,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import { useTeam } from "../hooks/useTeams";
import { useTeamMembers } from "../hooks/useTeams";
import TeamMemberManager from "./TeamMemberManager";
import TeamEditDialog from "./TeamEditDialog";

function statusIntent(status: string): Intent {
  return status === "ACTIVE" ? Intent.SUCCESS : Intent.NONE;
}

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

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const {
    team,
    loading: teamLoading,
    error: teamError,
    refetch: refetchTeam,
  } = useTeam(teamId);

  const {
    members,
    loading: membersLoading,
    error: membersError,
    refetch: refetchMembers,
  } = useTeamMembers(teamId);

  if (teamLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
        <Spinner size={48} />
      </div>
    );
  }

  if (teamError || !team) {
    return (
      <div style={{ padding: 24 }}>
        <NonIdealState
          icon="warning-sign"
          title="Failed to load team"
          description={teamError ?? "Team not found"}
          action={
            <Button icon="refresh" text="Retry" onClick={refetchTeam} />
          }
        />
      </div>
    );
  }

  const leadCount = members.filter((m) => m.role === "TEAM_LEAD").length;
  const memberCount = members.filter((m) => m.role === "MEMBER").length;
  const observerCount = members.filter((m) => m.role === "OBSERVER").length;

  return (
    <div style={{ padding: 16 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: "1px solid var(--cds-border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {team.team_name}
          </h2>
          <Tag
            minimal
            intent={statusIntent(team.status)}
            style={{ fontSize: 11 }}
          >
            {team.status}
          </Tag>
        </div>
        <Button
          icon="edit"
          intent={Intent.PRIMARY}
          small
          onClick={() => setEditOpen(true)}
        >
          Edit
        </Button>
      </div>

      <Tabs
        selectedTabId={activeTab}
        onChange={(id) => setActiveTab(id as string)}
      >
        <Tab id="overview" title="Overview" panel={
          <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            <Card elevation={Elevation.ONE} style={{ background: "var(--cds-background)", borderRadius: 0 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Description</div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 13, lineHeight: 1.5 }}>
                {team.description ?? "No description provided."}
              </div>
            </Card>

            <Card elevation={Elevation.ONE} style={{ background: "var(--cds-background)", borderRadius: 0 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Metadata</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                <div>
                  <span className={Classes.TEXT_MUTED}>Created</span>
                  <div>{formatDate(team.created_at)}</div>
                </div>
                <div>
                  <span className={Classes.TEXT_MUTED}>Members</span>
                  <div>{team.member_count}</div>
                </div>
              </div>
            </Card>

            {team.campaigns && team.campaigns.length > 0 && (
              <Card elevation={Elevation.ONE} style={{ background: "var(--cds-background)", borderRadius: 0 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Linked Campaigns</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {team.campaigns.map((c) => (
                    <Tag key={c.id} minimal intent={Intent.PRIMARY} style={{ fontSize: 11 }}>
                      {c.name}
                    </Tag>
                  ))}
                </div>
              </Card>
            )}
          </div>
        } />

        <Tab id="members" title="Members" panel={
          <div style={{ paddingTop: 16 }}>
            {membersLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                <Spinner size={36} />
              </div>
            ) : membersError ? (
              <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
                {membersError}
              </Callout>
            ) : (
              <TeamMemberManager
                teamId={team.id}
                members={members}
                onRefetch={refetchMembers}
              />
            )}
          </div>
        } />

        <Tab id="capacity" title="Capacity" panel={
          <div style={{ paddingTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            <Card elevation={Elevation.ONE} style={{ background: "var(--cds-background)", borderRadius: 0, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--cds-text-primary)" }}>{members.length}</div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginTop: 4 }}>Total Members</div>
            </Card>
            <Card elevation={Elevation.ONE} style={{ background: "var(--cds-background)", borderRadius: 0, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--cds-text-primary)" }}>{leadCount}</div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginTop: 4 }}>Team Leads</div>
            </Card>
            <Card elevation={Elevation.ONE} style={{ background: "var(--cds-background)", borderRadius: 0, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--cds-text-primary)" }}>{memberCount}</div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginTop: 4 }}>Members</div>
            </Card>
            <Card elevation={Elevation.ONE} style={{ background: "var(--cds-background)", borderRadius: 0, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--cds-text-primary)" }}>{observerCount}</div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginTop: 4 }}>Observers</div>
            </Card>
          </div>
        } />
      </Tabs>

      <TeamEditDialog
        isOpen={editOpen}
        team={team}
        onClose={() => setEditOpen(false)}
        onUpdated={() => {
          refetchTeam();
          refetchMembers();
        }}
      />
    </div>
  );
}
