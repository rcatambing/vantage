import { useState } from "react";
import {
  Button,
  Callout,
  Intent,
  NonIdealState,
  Spinner,
  Switch,
  Tag,
} from "@blueprintjs/core";
import { useNavigate, useSearchParams } from "react-router";
import { useOfficeList } from "../hooks/useOfficeList";
import { OfficeFilterBar } from "./OfficeFilterBar";
import { OfficeListTable } from "./OfficeListTable";
import { OfficeCreateDialog } from "./OfficeCreateDialog";
import type { OfficeStatus, OfficeType } from "../types";
import { ACTIVE_OFFICE_STATUSES } from "../types";

export default function OfficesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const showAll = searchParams.get("show_all") === "true";

  const [search, setSearch] = useState("");
  const [officeTypeFilter, setOfficeTypeFilter] = useState<OfficeType | "">("");
  const [statusFilter, setStatusFilter] = useState<OfficeStatus | "">("");
  const [createOpen, setCreateOpen] = useState(false);

  const { items, loading, error, refetch } = useOfficeList(
    statusFilter
      ? { status: statusFilter, office_type: officeTypeFilter || undefined, search: search || undefined }
      : { office_type: officeTypeFilter || undefined, search: search || undefined }
  );

  // Client-side status filter when no explicit status is selected and showAll is false
  const displayed = statusFilter || showAll
    ? items
    : items.filter((o) => ACTIVE_OFFICE_STATUSES.includes(o.status));

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
        title="Failed to load offices"
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
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Offices</h2>
        <Tag minimal style={{ fontSize: 12 }}>
          {displayed.length}
        </Tag>
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}
        >
          <Switch
            label="Show all statuses"
            checked={showAll}
            onChange={(e) => toggleShowAll((e.target as HTMLInputElement).checked)}
            inline
            style={{ marginBottom: 0 }}
          />
          <Button
            icon="plus"
            intent={Intent.PRIMARY}
            text="New Office"
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Filters */}
      <OfficeFilterBar
        search={search}
        onSearchChange={setSearch}
        officeTypeFilter={officeTypeFilter}
        onOfficeTypeChange={setOfficeTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Content */}
      {displayed.length === 0 ? (
        <NonIdealState
          icon="office"
          title={showAll ? "No offices found" : "No active offices"}
          description={
            showAll
              ? "Create the first office to get started."
              : "All offices are inactive or closed. Toggle the switch above to view them."
          }
          action={
            <Button
              icon="plus"
              intent={Intent.PRIMARY}
              text="New Office"
              onClick={() => setCreateOpen(true)}
            />
          }
        />
      ) : (
        <OfficeListTable
          offices={displayed}
          onRowClick={(id) => navigate(`/offices/${id}`)}
        />
      )}

      <OfficeCreateDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={refetch}
      />
    </div>
  );
}
