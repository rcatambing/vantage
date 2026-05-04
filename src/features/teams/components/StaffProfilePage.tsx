import {
  Card,
  Elevation,
  Tag,
  Intent,
  Spinner,
  NonIdealState,
  Button,
  Classes,
  Callout,
} from "@blueprintjs/core";
import { useParams } from "react-router";
import { useStaffProfile } from "../hooks/useTeams";

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

function roleIntent(role: string): Intent {
  switch (role) {
    case "TEAM_LEAD":
      return Intent.PRIMARY;
    case "MEMBER":
      return Intent.SUCCESS;
    case "OBSERVER":
      return Intent.NONE;
    default:
      return Intent.NONE;
  }
}

export default function StaffProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { profile, loading, error, refetch } = useStaffProfile(userId);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
        <Spinner size={48} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ padding: 24 }}>
        <NonIdealState
          icon="warning-sign"
          title="Failed to load profile"
          description={error ?? "Profile not found"}
          action={<Button icon="refresh" text="Retry" onClick={refetch} />}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
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
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Staff Profile
        </h2>
        <Tag
          minimal
          intent={
            profile.status === "ACTIVE"
              ? Intent.SUCCESS
              : profile.status === "SUSPENDED"
              ? Intent.DANGER
              : Intent.NONE
          }
          style={{ fontSize: 11 }}
        >
          {profile.status}
        </Tag>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {/* Left column — Profile */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card
            elevation={Elevation.ONE}
            style={{ background: "var(--cds-background)", borderRadius: 0 }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: 12,
                fontSize: 14,
                borderBottom: "1px solid var(--cds-border-subtle)",
                paddingBottom: 8,
              }}
            >
              Identity
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: "8px 16px",
                fontSize: 13,
              }}
            >
              <span className={Classes.TEXT_MUTED}>Full Name</span>
              <span>{profile.full_name}</span>

              <span className={Classes.TEXT_MUTED}>Preferred</span>
              <span>{profile.preferred_name ?? "—"}</span>

              <span className={Classes.TEXT_MUTED}>Staff Type</span>
              <span>{profile.staff_type}</span>

              <span className={Classes.TEXT_MUTED}>User ID</span>
              <span className={Classes.TEXT_MUTED}>{profile.user_id}</span>
            </div>
          </Card>

          <Card
            elevation={Elevation.ONE}
            style={{ background: "var(--cds-background)", borderRadius: 0 }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: 12,
                fontSize: 14,
                borderBottom: "1px solid var(--cds-border-subtle)",
                paddingBottom: 8,
              }}
            >
              Teams & Roles
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {profile.teams.map((t) => (
                <div
                  key={t.team_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--cds-border-subtle)",
                  }}
                >
                  <span style={{ fontSize: 13 }}>{t.team_name}</span>
                  <Tag
                    minimal
                    intent={roleIntent(t.role)}
                    style={{ fontSize: 11 }}
                  >
                    {t.role.replace("_", " ")}
                  </Tag>
                </div>
              ))}
              {profile.teams.length === 0 && (
                <span className={Classes.TEXT_MUTED} style={{ fontSize: 13 }}>
                  Not assigned to any team.
                </span>
              )}
            </div>
          </Card>

          <Card
            elevation={Elevation.ONE}
            style={{ background: "var(--cds-background)", borderRadius: 0 }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: 12,
                fontSize: 14,
                borderBottom: "1px solid var(--cds-border-subtle)",
                paddingBottom: 8,
              }}
            >
              Districts
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.district_names.map((d) => (
                <Tag key={d} minimal style={{ fontSize: 11 }}>
                  {d}
                </Tag>
              ))}
              {profile.district_names.length === 0 && (
                <span className={Classes.TEXT_MUTED} style={{ fontSize: 13 }}>
                  No districts assigned.
                </span>
              )}
            </div>
          </Card>
        </div>

        {/* Right column — Contacts & Documents */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card
            elevation={Elevation.ONE}
            style={{ background: "var(--cds-background)", borderRadius: 0 }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: 12,
                fontSize: 14,
                borderBottom: "1px solid var(--cds-border-subtle)",
                paddingBottom: 8,
              }}
            >
              Contact
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: "8px 16px",
                fontSize: 13,
              }}
            >
              <span className={Classes.TEXT_MUTED}>Primary</span>
              <span>{profile.primary_contact ?? "—"}</span>

              <span className={Classes.TEXT_MUTED}>Last Activity</span>
              <span>{formatDate(profile.last_activity)}</span>
            </div>
          </Card>

          <Card
            elevation={Elevation.ONE}
            style={{ background: "var(--cds-background)", borderRadius: 0 }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: 12,
                fontSize: 14,
                borderBottom: "1px solid var(--cds-border-subtle)",
                paddingBottom: 8,
              }}
            >
              Documents
            </div>
            <Callout
              intent={Intent.NONE}
              icon="info-sign"
              style={{ fontSize: 13 }}
            >
              Document management coming soon.
            </Callout>
          </Card>
        </div>
      </div>
    </div>
  );
}
