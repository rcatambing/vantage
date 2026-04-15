import { HTMLTable, Button, Spinner, NonIdealState, Callout, Intent } from "@blueprintjs/core";
import { useNavigate, useParams } from "react-router";
import type { CommunityLeader } from "../types";
import { SupportStatusTag } from "./SupportStatusTag";
import { InfluenceTag } from "./InfluenceTag";

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

interface Props {
  items: CommunityLeader[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  loading: boolean;
  error: string | null;
  onAddClick: () => void;
}

export function LeaderListTable({
  items,
  total,
  page,
  totalPages,
  onPageChange,
  loading,
  error,
  onAddClick,
}: Props) {
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId: string }>();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <Callout intent={Intent.DANGER} icon="error" title="Failed to load leaders" style={{ margin: "16px 0" }}>
        {error}
      </Callout>
    );
  }

  if (items.length === 0) {
    return (
      <NonIdealState
        icon="person"
        title="No community leaders yet"
        description="Add the first community leader for this campaign."
        action={
          <Button intent={Intent.PRIMARY} icon="add" onClick={onAddClick} style={{ borderRadius: 0 }}>
            Add Leader
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <HTMLTable
        bordered
        striped
        interactive
        style={{ width: "100%", fontSize: 13 }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Organization</th>
            <th>Affiliation</th>
            <th>Influence</th>
            <th>Support</th>
            <th>District</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map((leader) => {
            const isKeyInfluencer = leader.influence_level === "KEY_INFLUENCER";
            const isOpponent = leader.support_status === "OPPONENT";
            return (
              <tr
                key={leader.id}
                onClick={() =>
                  navigate(`/campaigns/${campaignId}/leaders/${leader.id}`)
                }
                style={{
                  fontWeight: isKeyInfluencer ? 600 : undefined,
                  backgroundColor: isOpponent
                    ? "rgba(218, 30, 40, 0.06)"
                    : undefined,
                  cursor: "pointer",
                }}
              >
                <td style={{ fontWeight: isKeyInfluencer ? 600 : undefined }}>
                  {leader.full_name}
                </td>
                <td>{leader.organization ?? "—"}</td>
                <td>{leader.affiliation ?? "—"}</td>
                <td>
                  <InfluenceTag level={leader.influence_level} />
                </td>
                <td>
                  <SupportStatusTag status={leader.support_status} />
                </td>
                <td>{leader.district_name ?? "—"}</td>
                <td>{leader.relationship_owner_id ? `User #${leader.relationship_owner_id}` : "—"}</td>
                <td>{leader.status}</td>
                <td>{formatDate(leader.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </HTMLTable>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontSize: 13,
            color: "var(--cds-text-secondary, #525252)",
          }}
        >
          <Button
            small
            minimal
            icon="chevron-left"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            style={{ borderRadius: 0 }}
          />
          <span>
            Page {page} of {totalPages} — {total} total
          </span>
          <Button
            small
            minimal
            icon="chevron-right"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            style={{ borderRadius: 0 }}
          />
        </div>
      )}
    </div>
  );
}
