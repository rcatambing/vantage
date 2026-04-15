import { useState } from "react";
import { Button, Intent } from "@blueprintjs/core";
import { useParams } from "react-router";
import { AccountGate } from "./AccountGate";
import { LeaderFilterBar } from "./LeaderFilterBar";
import { LeaderListTable } from "./LeaderListTable";
import { LeaderCreateDialog } from "./LeaderCreateDialog";
import { useLeaders } from "../hooks/useLeaders";
import type { InfluenceLevel, SupportStatus } from "../types";

export default function CommunityLeadersPage() {
  return (
    <AccountGate
      allowedTypes={["ELECTION"]}
      deniedMessage="Community leader profiles are only available for Election campaigns."
    >
      <CommunityLeadersContent />
    </AccountGate>
  );
}

function CommunityLeadersContent() {
  const { campaignId } = useParams<{ campaignId: string }>();

  const [search, setSearch] = useState("");
  const [districtIdFilter, setDistrictIdFilter] = useState("");
  const [ownerIdFilter, setOwnerIdFilter] = useState("");
  const [influenceFilter, setInfluenceFilter] = useState<InfluenceLevel | "">("");
  const [supportFilter, setSupportFilter] = useState<SupportStatus | "">("");
  const [createOpen, setCreateOpen] = useState(false);

  const { items, total, page, setPage, totalPages, loading, error, refetch } =
    useLeaders({
      campaign_id: campaignId,
      district_id: districtIdFilter || undefined,
      relationship_owner_id: ownerIdFilter || undefined,
      influence_level: influenceFilter || undefined,
      support_status: supportFilter || undefined,
      search: search || undefined,
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
            Community Leaders
          </h2>
          <Button
            icon="add"
            intent={Intent.PRIMARY}
            onClick={() => setCreateOpen(true)}
            small
            style={{ borderRadius: 0 }}
          >
            Add Leader
          </Button>
        </div>

        {/* ── Filter bar ── */}
        <div style={{ marginBottom: 12 }}>
          <LeaderFilterBar
            search={search}
            onSearchChange={setSearch}
            districtIdFilter={districtIdFilter}
            onDistrictIdChange={setDistrictIdFilter}
            ownerIdFilter={ownerIdFilter}
            onOwnerIdChange={setOwnerIdFilter}
            influenceFilter={influenceFilter}
            onInfluenceChange={setInfluenceFilter}
            supportFilter={supportFilter}
            onSupportChange={setSupportFilter}
          />
        </div>

        {/* ── Table ── */}
        <LeaderListTable
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
          <LeaderCreateDialog
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
