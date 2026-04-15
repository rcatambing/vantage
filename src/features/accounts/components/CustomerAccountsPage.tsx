import { useState } from "react";
import { Button, Intent } from "@blueprintjs/core";
import { useParams } from "react-router";
import { AccountGate } from "./AccountGate";
import { AccountFilterBar } from "./AccountFilterBar";
import { AccountListTable } from "./AccountListTable";
import { AccountCreateDialog } from "./AccountCreateDialog";
import { useAccounts } from "../hooks/useAccounts";
import type { AccountStatus, AccountSegment } from "../types";

export default function CustomerAccountsPage() {
  return (
    <AccountGate
      allowedTypes={["OPERATIONS", "SPECIAL_PROJECT"]}
      deniedMessage="Customer accounts are not available for Election campaigns."
    >
      <CustomerAccountsContent />
    </AccountGate>
  );
}

function CustomerAccountsContent() {
  const { campaignId } = useParams<{ campaignId: string }>();

  const [search, setSearch] = useState("");
  const [districtIdFilter, setDistrictIdFilter] = useState("");
  const [ownerIdFilter, setOwnerIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "">("");
  const [segmentFilter, setSegmentFilter] = useState<AccountSegment | "">("");
  const [affiliationTypeIdFilter, setAffiliationTypeIdFilter] = useState("");
  const [affiliationIdFilter, setAffiliationIdFilter] = useState("");
  const [signalTypeIdFilter, setSignalTypeIdFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const { items, total, page, setPage, totalPages, loading, error, refetch } =
    useAccounts({
      campaign_id: campaignId,
      status: statusFilter || undefined,
      segment: segmentFilter || undefined,
      district_id: districtIdFilter || undefined,
      owner_id: ownerIdFilter || undefined,
      search: search || undefined,
      affiliation_type_id: affiliationTypeIdFilter || undefined,
      affiliation_id: affiliationIdFilter || undefined,
      signal_type_id: signalTypeIdFilter || undefined,
    });

  return (
    <div style={{ padding: 16 }}>
        {/* ── Page header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            paddingBottom: 10,
            borderBottom: "1px solid var(--cds-border-subtle, #c6c6c6)",
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
            Customer Accounts
          </h2>
          <Button
            icon="add"
            intent={Intent.PRIMARY}
            onClick={() => setCreateOpen(true)}
            small
            style={{ borderRadius: 0 }}
          >
            Add Account
          </Button>
        </div>

        {/* ── Filter bar ── */}
        <div style={{ marginBottom: 12 }}>
          <AccountFilterBar
            search={search}
            onSearchChange={setSearch}
            districtIdFilter={districtIdFilter}
            onDistrictIdChange={setDistrictIdFilter}
            ownerIdFilter={ownerIdFilter}
            onOwnerIdChange={setOwnerIdFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            segmentFilter={segmentFilter}
            onSegmentChange={setSegmentFilter}
            affiliationTypeIdFilter={affiliationTypeIdFilter}
            onAffiliationTypeIdChange={setAffiliationTypeIdFilter}
            affiliationIdFilter={affiliationIdFilter}
            onAffiliationIdChange={setAffiliationIdFilter}
            signalTypeIdFilter={signalTypeIdFilter}
            onSignalTypeIdChange={setSignalTypeIdFilter}
          />
        </div>

        {/* ── Table ── */}
        <AccountListTable
          items={items}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loading={loading}
          error={error}
          onAddClick={() => setCreateOpen(true)}
        />

        {/* ── Create dialog ── */}
        {campaignId && (
          <AccountCreateDialog
            isOpen={createOpen}
            onClose={() => setCreateOpen(false)}
            campaignId={campaignId}
            onSuccess={() => {
              refetch();
              setCreateOpen(false);
            }}
          />
        )}
    </div>
  );
}
