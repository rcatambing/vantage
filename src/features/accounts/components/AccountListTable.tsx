import {
  HTMLTable,
  Button,
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Tag,
} from "@blueprintjs/core";
import { useNavigate, useParams } from "react-router";
import type { CustomerAccount } from "../types";
import { AccountStatusTag } from "./AccountStatusTag";

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

const SEGMENT_LABEL: Record<string, string> = {
  ENTERPRISE: "Enterprise",
  MID_MARKET: "Mid-Market",
  SMB: "SMB",
  GOVERNMENT: "Government",
  NGO: "NGO",
};

interface Props {
  items: CustomerAccount[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  loading: boolean;
  error: string | null;
  onAddClick: () => void;
}

export function AccountListTable({
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
      <Callout intent={Intent.DANGER} icon="error" title="Failed to load accounts" style={{ margin: "16px 0", borderRadius: 0 }}>
        {error}
      </Callout>
    );
  }

  if (items.length === 0) {
    return (
      <NonIdealState
        icon="office"
        title="No accounts yet"
        description="Add the first customer account for this campaign."
        action={
          <Button intent={Intent.PRIMARY} icon="add" onClick={onAddClick} style={{ borderRadius: 0 }}>
            Add Account
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
            <th>Account Name</th>
            <th>Segment</th>
            <th>District</th>
            <th>Primary Contact</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map((acct) => (
            <tr
              key={acct.id}
              onClick={() =>
                navigate(`/campaigns/${campaignId}/accounts/${acct.id}`)
              }
              style={{ cursor: "pointer" }}
            >
              <td>{acct.account_name}</td>
              <td>
                {acct.segment ? (
                  <Tag minimal style={{ borderRadius: 0, fontSize: 12 }}>
                    {SEGMENT_LABEL[acct.segment] ?? acct.segment}
                  </Tag>
                ) : (
                  "—"
                )}
              </td>
              <td>{acct.district_name ?? "—"}</td>
              <td>
                {acct.has_contact ? (
                  <Tag icon="lock" minimal style={{ borderRadius: 0, fontSize: 12 }}>
                    {acct.primary_contact_name ?? "On file"}
                  </Tag>
                ) : (
                  acct.primary_contact_name ?? "—"
                )}
              </td>
              <td>
                <AccountStatusTag status={acct.status} />
              </td>
              <td>{acct.owner_id ? `User #${acct.owner_id}` : "—"}</td>
              <td>{formatDate(acct.created_at)}</td>
            </tr>
          ))}
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
