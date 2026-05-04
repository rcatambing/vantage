import { useState } from "react";
import {
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Tag,
  Button,
  FormGroup,
  InputGroup,
  TextArea,
  HTMLSelect,
  Classes,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import type { TicketSeverity, TicketStatus } from "../types";
import {
  TICKET_TYPE_LABEL,
} from "../types";
import { useTicket } from "../hooks/useTicket";
import { useTicketMutations } from "../hooks/useTicketMutations";
import TicketStatusTag from "./TicketStatusTag";
import TicketSeverityTag from "./TicketSeverityTag";
import SLABadge from "./SLABadge";
import SLATimeline from "./SLATimeline";
import RelationshipGraph from "./RelationshipGraph";
import ReassignmentTimeline from "./ReassignmentTimeline";
import type { TicketLocationHistoryEntry } from "../types";
import UserSuggest from "../../../components/suggest/UserSuggest";
import CampaignSuggest from "../../../components/suggest/CampaignSuggest";
import { useCampaignSuggestData } from "../../../hooks/useCampaignSuggestData";

const SEVERITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MODERATE", label: "Moderate" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "ON_HOLD", label: "On Hold" },
];

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function LocationHistoryList({
  entries,
}: {
  entries: TicketLocationHistoryEntry[];
}) {
  if (entries.length === 0) return null;

  return (
    <section style={{ marginTop: 24 }}>
      <h4 className="bp5-heading" style={{ fontSize: 14, marginBottom: 8 }}>
        Location Change History
      </h4>
      <ul
        className="bp5-list bp5-list-unstyled"
        style={{ margin: 0, padding: 0 }}
      >
        {entries.map((entry) => (
          <li
            key={entry.id}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid var(--cds-border-subtle, #393939)",
              fontSize: 12,
            }}
          >
            <div style={{ color: "var(--cds-text-secondary, #c6c6c6)" }}>
              {formatDateTime(entry.changed_at)} —{" "}
              <strong>{entry.changed_by.slice(0, 8)}…</strong>
            </div>
            <div>
              Changed: <code>{entry.changed_fields.join(", ")}</code>
            </div>
            <div
              style={{
                fontStyle: "italic",
                color: "var(--cds-text-secondary, #c6c6c6)",
              }}
            >
              &ldquo;{entry.change_reason}&rdquo;
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ticket, locationHistory, loading, error, refetch } = useTicket(id);
  const mutations = useTicketMutations({
    onSuccess: refetch,
    onLocationMutationSuccess: refetch,
  });
  const { items: campaigns } = useCampaignSuggestData();

  const [editing, setEditing] = useState(false);
  const [editSeverity, setEditSeverity] = useState<TicketSeverity>("MODERATE");
  const [editStatus, setEditStatus] = useState<TicketStatus>("DRAFT");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAssigneeId, setEditAssigneeId] = useState("");
  const [editCampaignId, setEditCampaignId] = useState("");

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 80,
        }}
      >
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <NonIdealState
        icon="error"
        title="Ticket not found"
        description={error ?? "The requested ticket could not be loaded."}
        action={
          <Button text="Back to Tickets" onClick={() => navigate("/tickets")} />
        }
      />
    );
  }

  const campaignName =
    campaigns.find((c) => c.id === ticket.campaign_id)?.name ?? ticket.campaign_id;

  const startEditing = () => {
    setEditTitle(ticket.title);
    setEditDescription(ticket.description ?? "");
    setEditSeverity(ticket.severity);
    setEditStatus(ticket.status);
    setEditAssigneeId(ticket.assignee_id ?? "");
    setEditCampaignId(ticket.campaign_id);
    setEditing(true);
    mutations.clearErrors();
  };

  const cancelEditing = () => {
    setEditing(false);
    mutations.clearErrors();
  };

  const handleSave = async () => {
    const success = await mutations.update(ticket.id, {
      title: editTitle.trim() || undefined,
      description: editDescription.trim() || undefined,
      severity: editSeverity,
      status: editStatus,
      assignee_id: editAssigneeId || undefined,
    });
    if (success) setEditing(false);
  };

  const handleDelete = async () => {
    const success = await mutations.remove(ticket.id);
    if (success) navigate("/tickets");
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <Button
          minimal
          icon="arrow-left"
          text="Tickets"
          onClick={() => navigate("/tickets")}
        />
        <code className={Classes.TEXT_MUTED} style={{ fontSize: 14 }}>
          {ticket.ticket_number}
        </code>
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            flex: 1,
            minWidth: 200,
          }}
        >
          {ticket.title}
        </h1>
        <TicketSeverityTag severity={ticket.severity} />
        <TicketStatusTag status={ticket.status} />
        <SLABadge slaBreached={ticket.sla_breached} slaDueAt={ticket.sla_due_at} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {!editing && (
            <Button small icon="edit" text="Edit" onClick={startEditing} />
          )}
          {ticket.status === "DRAFT" && (
            <Button
              small
              icon="trash"
              intent={Intent.DANGER}
              text="Delete"
              onClick={handleDelete}
              loading={mutations.submitting}
            />
          )}
        </div>
      </div>

      {mutations.error && (
        <Callout
          intent={Intent.DANGER}
          icon="error"
          style={{ marginBottom: 16 }}
        >
          {mutations.error}
        </Callout>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        {/* Left panel */}
        <div>
          {editing ? (
            <>
              <FormGroup label="Title">
                <InputGroup
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </FormGroup>
              <FormGroup label="Description">
                <TextArea
                  fill
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </FormGroup>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <FormGroup label="Severity">
                  <HTMLSelect
                    fill
                    value={editSeverity}
                    onChange={(e) =>
                      setEditSeverity(e.target.value as TicketSeverity)
                    }
                    options={SEVERITY_OPTIONS}
                  />
                </FormGroup>
                <FormGroup label="Status">
                  <HTMLSelect
                    fill
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as TicketStatus)
                    }
                    options={STATUS_OPTIONS}
                  />
                </FormGroup>
              </div>
              <FormGroup label="Campaign" labelInfo="(required)">
                <CampaignSuggest
                  selectedId={editCampaignId}
                  onSelect={setEditCampaignId}
                />
              </FormGroup>
              <FormGroup label="Assignee">
                <UserSuggest
                  selectedId={editAssigneeId}
                  onSelect={setEditAssigneeId}
                />
              </FormGroup>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Button
                  intent={Intent.PRIMARY}
                  text="Save"
                  onClick={handleSave}
                  loading={mutations.submitting}
                />
                <Button text="Cancel" onClick={cancelEditing} />
              </div>
            </>
          ) : (
            <>
              <p
                style={{
                  color: "var(--cds-text-secondary, #c6c6c6)",
                  fontSize: 14,
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                {ticket.description || "No description provided."}
              </p>

              {/* Metadata grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px 24px",
                  fontSize: 13,
                  marginBottom: 24,
                }}
              >
                <div>
                  <span className={Classes.TEXT_MUTED}>Campaign</span>
                  <div>{campaignName}</div>
                </div>
                <div>
                  <span className={Classes.TEXT_MUTED}>Type</span>
                  <div>
                    <Tag minimal>
                      {TICKET_TYPE_LABEL[ticket.ticket_type]}
                    </Tag>
                  </div>
                </div>
                <div>
                  <span className={Classes.TEXT_MUTED}>Severity</span>
                  <div>
                    <TicketSeverityTag severity={ticket.severity} />
                  </div>
                </div>
                <div>
                  <span className={Classes.TEXT_MUTED}>Status</span>
                  <div>
                    <TicketStatusTag status={ticket.status} />
                  </div>
                </div>
                <div>
                  <span className={Classes.TEXT_MUTED}>Due Date</span>
                  <div>{formatDateTime(ticket.due_date)}</div>
                </div>
                <div>
                  <span className={Classes.TEXT_MUTED}>Objective</span>
                  <div>
                    {ticket.objective_id ? (
                      <code>{ticket.objective_id.slice(0, 8)}…</code>
                    ) : (
                      <span className={Classes.TEXT_MUTED}>None</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className={Classes.TEXT_MUTED}>Created</span>
                  <div>{formatDateTime(ticket.created_at)}</div>
                </div>
                <div>
                  <span className={Classes.TEXT_MUTED}>Resolved</span>
                  <div>{formatDateTime(ticket.resolved_at)}</div>
                </div>
              </div>
            </>
          )}

          {/* Relationships */}
          <RelationshipGraph
            ticketId={ticket.id}
            relationships={ticket.relationships}
            onMutate={refetch}
          />

          {/* Location history */}
          <LocationHistoryList entries={locationHistory} />
        </div>

        {/* Right rail */}
        <div>
          <div
            style={{
              padding: 16,
              background: "var(--cds-layer-01, #262626)",
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            <h4
              style={{
                margin: "0 0 12px 0",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              People
            </h4>
            <div style={{ marginBottom: 8 }}>
              <span className={Classes.TEXT_MUTED}>Owner</span>
              <div>
                <code>{ticket.owner_id.slice(0, 8)}…</code>
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span className={Classes.TEXT_MUTED}>Assignee</span>
              <div>
                {ticket.assignee_id ? (
                  <code>{ticket.assignee_id.slice(0, 8)}…</code>
                ) : (
                  <span className={Classes.TEXT_MUTED}>Unassigned</span>
                )}
              </div>
            </div>
            {ticket.assignee_team_id && (
              <div>
                <span className={Classes.TEXT_MUTED}>Team</span>
                <div>
                  <code>{ticket.assignee_team_id.slice(0, 8)}…</code>
                </div>
              </div>
            )}
          </div>

          {/* SLA Timeline */}
          <div
            style={{
              padding: 16,
              background: "var(--cds-layer-01, #262626)",
              marginBottom: 16,
            }}
          >
            <SLATimeline
              slaDueAt={ticket.sla_due_at}
              slaBreached={ticket.sla_breached}
              createdAt={ticket.created_at}
              resolvedAt={ticket.resolved_at}
            />
          </div>

          {/* Reassignment timeline */}
          <ReassignmentTimeline entries={ticket.reassignment_history} />
        </div>
      </div>
    </div>
  );
}
