import { useState, useMemo } from "react";
import {
  Button,
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Tag,
  ControlGroup,
} from "@blueprintjs/core";
import { useParams } from "react-router";
import type { VoterFilters } from "../types";
import { useVoterList } from "../hooks/useVoters";
import ElectionOnlyGate from "./ElectionOnlyGate";
import VoterSearchBar from "./VoterSearchBar";
import VoterFilterPanel from "./VoterFilterPanel";
import VoterImportDialog from "./VoterImportDialog";
import VoterCreateDialog from "./VoterCreateDialog";
import VoterListTable from "./VoterListTable";

export default function VotersPage() {
  return (
    <ElectionOnlyGate>
      <VotersPageContent />
    </ElectionOnlyGate>
  );
}

function VotersPageContent() {
  const { campaignId } = useParams<{ campaignId?: string }>();
  const [filters, setFilters] = useState<VoterFilters>({
    page: 1,
    page_size: 25,
  });
  const [importOpen, setImportOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, loading, error } = useVoterList(campaignId, filters);

  const hasFilters = useMemo(
    () =>
      !!(
        filters.status ||
        filters.age_group ||
        filters.gender ||
        filters.district_id ||
        filters.search
      ),
    [filters],
  );

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
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Voters</h2>
        {data && (
          <Tag minimal intent={Intent.NONE} style={{ fontSize: 12 }}>
            {data.total}
          </Tag>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button
            icon="import"
            text="Import"
            onClick={() => setImportOpen(true)}
          />
          <Button
            icon="plus"
            intent={Intent.PRIMARY}
            text="New Voter"
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Search & Filter bar */}
      <div style={{ marginBottom: 16 }}>
        <ControlGroup fill={false} style={{ gap: 8, flexWrap: "wrap" }}>
          <VoterSearchBar
            value={filters.search ?? ""}
            onChange={(search) =>
              setFilters((f) => ({ ...f, search: search || undefined, page: 1 }))
            }
          />
          <VoterFilterPanel
            filters={filters}
            onChange={(next) => setFilters((f) => ({ ...f, ...next, page: 1 }))}
          />
          {hasFilters && (
            <Button
              small
              minimal
              icon="filter-remove"
              text="Clear"
              onClick={() =>
                setFilters({ page: 1, page_size: 25 })
              }
            />
          )}
        </ControlGroup>
      </div>

      {/* Content area */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 60,
          }}
        >
          <Spinner size={20} />
        </div>
      )}

      {error && (
        <Callout
          intent={Intent.DANGER}
          icon="error"
          title="Could not load voters"
          style={{ marginBottom: 16 }}
        >
          {error}
        </Callout>
      )}

      {!loading && !error && data && data.items.length === 0 && (
        <NonIdealState
          icon="people"
          title="No voters"
          description="The voter registry is empty. Import voters or create one manually."
          action={
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                icon="import"
                text="Import Voters"
                onClick={() => setImportOpen(true)}
              />
              <Button
                intent={Intent.PRIMARY}
                icon="plus"
                text="New Voter"
                onClick={() => setCreateOpen(true)}
              />
            </div>
          }
        />
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <>
          <VoterListTable voters={data.items} />

          {/* Pagination */}
          {data.total > data.page_size && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 16,
              }}
            >
              <Button
                small
                minimal
                disabled={data.page <= 1}
                text="Previous"
                onClick={() =>
                  setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))
                }
              />
              <span
                style={{
                  fontSize: 12,
                  lineHeight: "30px",
                  color: "var(--cds-text-secondary, #525252)",
                }}
              >
                Page {data.page} of {Math.ceil(data.total / data.page_size)}
              </span>
              <Button
                small
                minimal
                disabled={data.page >= Math.ceil(data.total / data.page_size)}
                text="Next"
                onClick={() =>
                  setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))
                }
              />
            </div>
          )}
        </>
      )}

      <VoterImportDialog
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        campaignId={campaignId ?? ""}
      />
      <VoterCreateDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        campaignId={campaignId ?? ""}
      />
    </div>
  );
}
